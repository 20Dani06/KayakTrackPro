import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertSessionSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";
// Dynamic import for FIT parser (will be loaded when needed)

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.fit')) {
      cb(null, true);
    } else {
      cb(new Error('Only .fit files are allowed'));
    }
  }
});

async function parseFitFile(buffer: Buffer): Promise<any> {
  try {
    // Dynamic import for ES module compatibility
    const { default: FitParser } = await import("fit-file-parser");
    
    return new Promise((resolve, reject) => {
      const fitParser = new FitParser({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'km',
        temperatureUnit: 'celsius',
        elapsedRecordField: true,
        mode: 'list',
      });

      fitParser.parse(buffer, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    throw new Error(`Failed to load FIT parser: ${error}`);
  }
}

function extractSessionDataFromFit(fitData: any) {
  const { activity, sessions, records } = fitData;
  
  // Get session summary data
  const session = sessions?.[0] || {};
  const sessionActivity = activity?.[0] || {};
  
  // Extract basic session info
  const startTime = session.start_time || sessionActivity.timestamp || new Date();
  
  // Debug logging for distance
  console.log('Raw FIT data - session.total_distance:', session.total_distance);
  console.log('Raw FIT data - sessionActivity.total_distance:', sessionActivity.total_distance);
  
  // Extract distance - some FIT files store in different units
  let totalDistance = session.total_distance || sessionActivity.total_distance || 0;
  
  // If distance seems reasonable (between 1-100km), it's probably already in km
  // If it's a large number (>1000), it's likely in meters and needs conversion
  if (totalDistance > 1000) {
    // Large number indicates meters, convert to km
    totalDistance = totalDistance / 1000;
    console.log('Converting distance from meters to km:', totalDistance);
  } else {
    // Small number indicates it's already in km or a very short distance
    console.log('Distance appears to be in km already:', totalDistance);
  }
  
  const totalTimerTime = session.total_timer_time || 0; // seconds
  const totalMinutes = Math.round(totalTimerTime / 60);
  
  // Extract performance data
  const avgHeartRate = session.avg_heart_rate || null;
  const avgCadence = session.avg_cadence || null; // This is stroke rate for kayaking
  const avgPower = session.avg_power || null;
  const maxSpeed = session.max_speed ? session.max_speed * 3.6 : null; // Convert m/s to km/h
  const avgSpeed = session.avg_speed ? session.avg_speed * 3.6 : null;
  
  // Extract detailed data points from records
  const gpsCoordinates: string[] = [];
  const speedData: number[] = [];
  const heartRateData: number[] = [];
  const strokeRateData: number[] = [];
  const powerData: number[] = [];
  
  if (records && Array.isArray(records)) {
    records.forEach((record: any) => {
      // GPS coordinates
      if (record.position_lat && record.position_long) {
        const lat = record.position_lat * (180 / Math.pow(2, 31));
        const lng = record.position_long * (180 / Math.pow(2, 31));
        gpsCoordinates.push(`${lat},${lng}`);
      }
      
      // Speed data (convert m/s to km/h)
      if (record.speed !== undefined) {
        speedData.push(record.speed * 3.6);
      }
      
      // Heart rate data
      if (record.heart_rate !== undefined) {
        heartRateData.push(record.heart_rate);
      }
      
      // Stroke rate (cadence) data
      if (record.cadence !== undefined) {
        strokeRateData.push(record.cadence);
      }
      
      // Power data
      if (record.power !== undefined) {
        powerData.push(record.power);
      }
    });
  }
  
  // Determine session type based on data
  let sessionType = "Training";
  if (avgHeartRate && avgHeartRate > 180) {
    sessionType = "Race";
  } else if (avgHeartRate && avgHeartRate < 140) {
    sessionType = "Recovery";
  }
  
  return {
    date: startTime,
    sessionType,
    distance: totalDistance,
    duration: totalMinutes,
    heartRate: avgHeartRate,
    strokeRate: avgCadence,
    power: avgPower,
    fitFileData: JSON.stringify(fitData),
    gpsCoordinates: gpsCoordinates.length > 0 ? gpsCoordinates : null,
    speedData: speedData.length > 0 ? JSON.stringify(speedData) : null,
    heartRateData: heartRateData.length > 0 ? JSON.stringify(heartRateData) : null,
    strokeRateData: strokeRateData.length > 0 ? JSON.stringify(strokeRateData) : null,
    powerData: powerData.length > 0 ? JSON.stringify(powerData) : null,
    maxSpeed,
    avgSpeed,
    elevation: session.total_ascent || null,
    notes: "Imported from Garmin FIT file"
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse({
        ...req.body,
        date: new Date(req.body.date),
      });
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await storage.getRecentSessions(limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent sessions" });
    }
  });

  app.get("/api/sessions/date-range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "Start date and end date are required" });
      }
      const sessions = await storage.getSessionsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions by date range" });
    }
  });

  // FIT file upload route
  app.post("/api/sessions/upload-fit", upload.single('fitFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Parse the FIT file
      const fitData = await parseFitFile(req.file.buffer);

      // Extract session data from FIT file
      const sessionData = extractSessionDataFromFit(fitData);

      // Create session with FIT data
      const session = await storage.createSession(sessionData);

      res.json(session);
    } catch (error: any) {
      console.error('FIT file processing error:', error);
      res.status(400).json({ error: error.message || "Failed to process FIT file" });
    }
  });

  // User settings routes
  app.get("/api/user-settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user settings" });
    }
  });

  app.post("/api/user-settings", async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.updateUserSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid user settings data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

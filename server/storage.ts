import { sessions, userSettings, type Session, type InsertSession, type UserSettings, type InsertUserSettings } from "@shared/schema";

export interface IStorage {
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getAllSessions(): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | undefined>;
  getRecentSessions(limit: number): Promise<Session[]>;
  getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]>;
  
  // User settings operations
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, Session>;
  private userSettings: UserSettings | undefined;
  private currentSessionId: number;
  private currentSettingsId: number;

  constructor() {
    this.sessions = new Map();
    this.currentSessionId = 1;
    this.currentSettingsId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      // Ensure nullable fields are explicitly null instead of undefined
      heartRate: insertSession.heartRate ?? null,
      strokeRate: insertSession.strokeRate ?? null,
      power: insertSession.power ?? null,
      perceivedEffort: insertSession.perceivedEffort ?? null,
      notes: insertSession.notes ?? null,
      fitFileData: insertSession.fitFileData ?? null,
      gpsCoordinates: insertSession.gpsCoordinates ?? null,
      speedData: insertSession.speedData ?? null,
      heartRateData: insertSession.heartRateData ?? null,
      strokeRateData: insertSession.strokeRateData ?? null,
      powerData: insertSession.powerData ?? null,
      maxSpeed: insertSession.maxSpeed ?? null,
      avgSpeed: insertSession.avgSpeed ?? null,
      elevation: insertSession.elevation ?? null,
    };
    this.sessions.set(id, session);
    return session;
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getSessionById(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getRecentSessions(limit: number): Promise<Session[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.slice(0, limit);
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    const allSessions = await this.getAllSessions();
    return allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }

  async getUserSettings(): Promise<UserSettings | undefined> {
    return this.userSettings;
  }

  async updateUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    if (!this.userSettings) {
      this.userSettings = {
        id: this.currentSettingsId++,
        weight: insertSettings.weight ?? null,
        maxHeartRate: insertSettings.maxHeartRate ?? null,
        restingHeartRate: insertSettings.restingHeartRate ?? null,
        vo2Max: insertSettings.vo2Max ?? null,
      };
    } else {
      this.userSettings = {
        ...this.userSettings,
        weight: insertSettings.weight ?? this.userSettings.weight,
        maxHeartRate: insertSettings.maxHeartRate ?? this.userSettings.maxHeartRate,
        restingHeartRate: insertSettings.restingHeartRate ?? this.userSettings.restingHeartRate,
        vo2Max: insertSettings.vo2Max ?? this.userSettings.vo2Max,
      };
    }
    return this.userSettings;
  }
}

export const storage = new MemStorage();

import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  sessionType: text("session_type").notNull(),
  distance: real("distance").notNull(), // km
  duration: integer("duration").notNull(), // minutes
  heartRate: integer("heart_rate"), // bpm
  strokeRate: integer("stroke_rate"), // strokes per minute
  power: integer("power"), // watts
  perceivedEffort: integer("perceived_effort"), // 1-10 scale
  notes: text("notes"),
  
  // Garmin FIT file data
  fitFileData: text("fit_file_data"), // JSON string of parsed FIT data
  gpsCoordinates: text("gps_coordinates").array(), // Array of lat,lng strings
  speedData: text("speed_data"), // JSON array of speed points over time
  heartRateData: text("heart_rate_data"), // JSON array of HR points over time
  strokeRateData: text("stroke_rate_data"), // JSON array of stroke rate over time
  powerData: text("power_data"), // JSON array of power points over time
  maxSpeed: real("max_speed"), // km/h
  avgSpeed: real("avg_speed"), // km/h
  elevation: real("elevation"), // meters gained/lost
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  weight: real("weight"), // kg
  maxHeartRate: integer("max_heart_rate"), // bpm
  restingHeartRate: integer("resting_heart_rate"), // bpm
  vo2Max: real("vo2_max"), // ml/kg/min
});

export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end"),
  raceNumber: text("race_number"),
  eventNumber: text("event_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type DiaryEntry = typeof diaryEntries.$inferSelect;
export type InsertDiaryEntry = z.infer<typeof insertDiaryEntrySchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  weight: real("weight"), // kg
  maxHeartRate: integer("max_heart_rate"), // bpm
  restingHeartRate: integer("resting_heart_rate"), // bpm
  vo2Max: real("vo2_max"), // ml/kg/min
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

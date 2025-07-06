import { sessions, userSettings, type Session, type InsertSession, type UserSettings, type InsertUserSettings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getAllSessions(): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.date));
  }

  async getSessionById(id: number): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return session || undefined;
  }

  async getRecentSessions(limit: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.date))
      .limit(limit);
  }

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(
        // Note: Add proper date range filtering when needed
        desc(sessions.date)
      )
      .orderBy(desc(sessions.date));
  }

  async getUserSettings(): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .limit(1);
    return settings || undefined;
  }

  async updateUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    // Try to get existing settings
    const existing = await this.getUserSettings();
    
    if (existing) {
      // Update existing settings
      const [updated] = await db
        .update(userSettings)
        .set(insertSettings)
        .where(eq(userSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings
      const [created] = await db
        .insert(userSettings)
        .values(insertSettings)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();

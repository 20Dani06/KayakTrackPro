import { sessions, userSettings, diaryEntries, events,
  type Session,
  type InsertSession,
  type UserSettings,
  type InsertUserSettings,
  type DiaryEntry,
  type InsertDiaryEntry,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getAllSessions(): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | undefined>;
  updateSession(id: number, session: InsertSession): Promise<Session>;
  deleteSession(id: number): Promise<void>;
  getRecentSessions(limit: number): Promise<Session[]>;
  getSessionsByDateRange(startDate: Date, endDate: Date): Promise<Session[]>;
  
  // User settings operations
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Diary operations
  createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry>;
  getDiaryEntries(): Promise<DiaryEntry[]>;
  updateDiaryEntry(id: number, entry: InsertDiaryEntry): Promise<DiaryEntry>;
  deleteDiaryEntry(id: number): Promise<void>;

  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  updateEvent(id: number, event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
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

  async updateSession(id: number, update: InsertSession): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set(update)
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }

  async deleteSession(id: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
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

  async createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry> {
    const [created] = await db.insert(diaryEntries).values(entry).returning();
    return created;
  }

  async getDiaryEntries(): Promise<DiaryEntry[]> {
    return await db.select().from(diaryEntries).orderBy(desc(diaryEntries.date));
  }

  async updateDiaryEntry(id: number, entry: InsertDiaryEntry): Promise<DiaryEntry> {
    const [updated] = await db
      .update(diaryEntries)
      .set(entry)
      .where(eq(diaryEntries.id, id))
      .returning();
    return updated;
  }

  async deleteDiaryEntry(id: number): Promise<void> {
    await db.delete(diaryEntries).where(eq(diaryEntries.id, id));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.start));
  }

  async updateEvent(id: number, event: InsertEvent): Promise<Event> {
    const [updated] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }
}

export const storage = new DatabaseStorage();

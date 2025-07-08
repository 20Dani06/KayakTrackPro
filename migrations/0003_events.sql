-- Add events table for competitions
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  start TIMESTAMP NOT NULL,
  "end" TIMESTAMP,
  race_number TEXT,
  event_number TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

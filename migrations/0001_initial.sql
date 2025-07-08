-- Initial migration for PaddleTracker tables

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  session_type TEXT NOT NULL,
  distance REAL NOT NULL,
  duration INTEGER NOT NULL,
  heart_rate INTEGER,
  stroke_rate INTEGER,
  power INTEGER,
  perceived_effort INTEGER,
  notes TEXT,
  fit_file_data TEXT,
  gps_coordinates TEXT[],
  speed_data TEXT,
  heart_rate_data TEXT,
  stroke_rate_data TEXT,
  power_data TEXT,
  max_speed REAL,
  avg_speed REAL,
  elevation REAL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  weight REAL,
  max_heart_rate INTEGER,
  resting_heart_rate INTEGER,
  vo2_max REAL
);

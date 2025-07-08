-- Add diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

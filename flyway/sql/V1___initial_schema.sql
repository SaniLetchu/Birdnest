CREATE TABLE violations (
  drone_id TEXT PRIMARY KEY,
  closest_distance FLOAT NOT NULL,
  pilot_name TEXT,
  email TEXT,
  phone TEXT,
  last_seen TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  author VARCHAR(255),
  genre VARCHAR(255),
  cover_image_url TEXT,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  metadata_status VARCHAR(50) DEFAULT 'fetching' -- 'fetching', 'completed', 'failed'
);

-- Initial locations
INSERT INTO locations (name, description) VALUES ('Living Room Shelf', 'Main bookshelf in the living room');
INSERT INTO locations (name, description) VALUES ('Bedroom Nightstand', 'Books currently reading');

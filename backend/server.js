const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { processBookMetadata } = require('./services/bookFetcher');

const app = express();
const port = process.env.PORT || 6003;

app.use(cors());
app.use(express.json());

// API Endpoints

// Get all locations
app.get('/api/locations', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM locations ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Create a new location
app.post('/api/locations', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const result = await db.query(
      'INSERT INTO locations (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Get books for a specific location
app.get('/api/locations/:id/books', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM books WHERE location_id = $1 ORDER BY id DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books for location' });
  }
});

// Get all books (with optional search)
app.get('/api/books', async (req, res) => {
  const { search } = req.query;
  try {
    let query = `
      SELECT b.*, l.name as location_name
      FROM books b
      LEFT JOIN locations l ON b.location_id = l.id
    `;
    let params = [];

    if (search) {
      query += ` WHERE b.title ILIKE $1 OR b.author ILIKE $1 OR b.genre ILIKE $1 OR b.isbn ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY b.id DESC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Add a new book (triggers background fetch)
app.post('/api/books', async (req, res) => {
  const { isbn, location_id } = req.body;

  if (!isbn || !location_id) {
    return res.status(400).json({ error: 'ISBN and location_id are required' });
  }

  try {
    // 1. Create a placeholder record
    const insertResult = await db.query(
      `INSERT INTO books (isbn, location_id, title, author, genre, cover_image_url, metadata_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        isbn,
        location_id,
        'Fetching Data...',
        'Fetching...',
        'Fetching...',
        'https://via.placeholder.com/128x192.png?text=Loading...',
        'fetching'
      ]
    );

    const newBook = insertResult.rows[0];

    // 2. Respond to the client immediately
    res.status(202).json(newBook);

    // 3. Trigger background metadata fetch
    processBookMetadata(newBook.id, isbn);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Get total book counts
app.get('/api/stats', async (req, res) => {
  try {
    const totalResult = await db.query('SELECT COUNT(*) FROM books');
    res.json({ totalBooks: parseInt(totalResult.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
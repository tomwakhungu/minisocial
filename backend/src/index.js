const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'minisocial',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Initialize database
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// User routes
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post routes
app.post('/api/posts', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [user_id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comment routes
app.post('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, u.username 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = $1 
      ORDER BY c.created_at ASC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
};

startServer();

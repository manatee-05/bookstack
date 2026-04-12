const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://bookstack:password@db:5432/bookstack',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

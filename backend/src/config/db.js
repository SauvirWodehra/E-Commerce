/**
 * Database Configuration
 * 
 * Creates and exports a PostgreSQL connection pool using the `pg` library.
 * The pool is shared across the application to efficiently manage database connections.
 */

const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for most managed cloud DBs (Render, Neon)
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
    };

const pool = new Pool(poolConfig);

// Log successful connection on first query
pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL database');
});

// Log connection errors
pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  process.exit(-1);
});

module.exports = pool;

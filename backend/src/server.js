/**
 * Server Entry Point
 * 
 * Starts the Express server on the configured PORT.
 * Verifies database connectivity on startup.
 */

const app = require('./app');
const pool = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

/**
 * Starts the server after verifying database connection.
 */
const startServer = async () => {
  try {
    // Verify database connection before starting server
    const dbTest = await pool.query('SELECT NOW()');
    console.log(`[DB] PostgreSQL connected at: ${dbTest.rows[0].now}`);

    app.listen(PORT, () => {
      console.log(`[SERVER] Amazon Clone API running on http://localhost:${PORT}`);
      console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();

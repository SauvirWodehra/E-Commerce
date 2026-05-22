/**
 * User Model
 * 
 * Handles all database operations for user authentication and profile management.
 * Uses bcrypt for password hashing and JWT for token generation.
 */

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'amazon_clone_jwt_secret_key_2026_sde_assignment';
const SALT_ROUNDS = 10;

/**
 * Creates a new user with hashed password.
 * 
 * @param {object} userData - { name, email, password, mobile, secondaryEmail, addressLine, city, state, pincode }
 * @returns {object} Created user (without password_hash) + JWT token.
 */
const createUser = async (userData) => {
  const { name, email, password, mobile, secondaryEmail, addressLine, city, state, pincode } = userData;

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const query = `
    INSERT INTO users (name, email, password_hash, mobile, secondary_email, address_line, city, state, pincode)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, email, mobile, secondary_email, address_line, city, state, pincode, created_at
  `;

  const result = await pool.query(query, [
    name, email, passwordHash, mobile || null, secondaryEmail || null,
    addressLine || null, city || null, state || null, pincode || null
  ]);

  const user = result.rows[0];

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

/**
 * Authenticates a user by email and password.
 * 
 * @param {string} email - User email.
 * @param {string} password - Plain text password.
 * @returns {object|null} User + JWT token if valid, null otherwise.
 */
const authenticateUser = async (email, password) => {
  const query = `
    SELECT id, name, email, password_hash, mobile, secondary_email,
           address_line, city, state, pincode, created_at
    FROM users WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  // Remove password_hash from response
  const { password_hash, ...safeUser } = user;

  // Generate JWT
  const token = jwt.sign(
    { id: safeUser.id, email: safeUser.email, name: safeUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user: safeUser, token };
};

/**
 * Fetches a user by ID (for JWT verification on /me endpoint).
 * 
 * @param {string} userId - UUID of the user.
 * @returns {object|null} User object without password_hash.
 */
const getUserById = async (userId) => {
  const query = `
    SELECT id, name, email, mobile, secondary_email,
           address_line, city, state, pincode, created_at
    FROM users WHERE id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Checks if an email is already registered.
 * 
 * @param {string} email 
 * @returns {boolean}
 */
const emailExists = async (email) => {
  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows.length > 0;
};

module.exports = {
  createUser,
  authenticateUser,
  getUserById,
  emailExists,
};

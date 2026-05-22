/**
 * OTP Model
 * 
 * Manages one-time password generation, storage, and verification.
 * OTPs expire after 5 minutes.
 */

const pool = require('../config/db');

const OTP_EXPIRY_MINUTES = 5;

/**
 * Generates a 6-digit OTP.
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates and stores a new OTP.
 * Invalidates any existing unused OTPs for the same email+purpose.
 * 
 * @param {string} email
 * @param {string} purpose - 'REGISTER' or 'LOGIN'
 * @param {object|null} tempData - Registration data to store until OTP is verified
 * @returns {string} The generated 6-digit code
 */
const createOTP = async (email, purpose, tempData = null) => {
  // Invalidate old OTPs for this email+purpose
  await pool.query(
    `UPDATE otp_codes SET used = TRUE WHERE email = $1 AND purpose = $2 AND used = FALSE`,
    [email, purpose]
  );

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await pool.query(
    `INSERT INTO otp_codes (email, code, purpose, expires_at, temp_data)
     VALUES ($1, $2, $3, $4, $5)`,
    [email, code, purpose, expiresAt, tempData ? JSON.stringify(tempData) : null]
  );

  return code;
};

/**
 * Verifies an OTP code.
 * Returns the OTP record (with temp_data) if valid, null if invalid/expired.
 * Marks the OTP as used after successful verification.
 * 
 * @param {string} email
 * @param {string} code
 * @param {string} purpose
 * @returns {object|null}
 */
const verifyOTP = async (email, code, purpose) => {
  const result = await pool.query(
    `SELECT * FROM otp_codes
     WHERE email = $1 AND code = $2 AND purpose = $3
       AND used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, code, purpose]
  );

  if (result.rows.length === 0) return null;

  const otp = result.rows[0];

  // Mark as used
  await pool.query(`UPDATE otp_codes SET used = TRUE WHERE id = $1`, [otp.id]);

  return otp;
};

module.exports = {
  createOTP,
  verifyOTP,
};

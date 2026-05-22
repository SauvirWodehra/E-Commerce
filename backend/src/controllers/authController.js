/**
 * Auth Controller
 * 
 * 2-step auth flow with OTP verification:
 * 
 * REGISTER:
 *   1. POST /api/auth/register → validates, stores temp data, sends OTP email
 *   2. POST /api/auth/verify-otp → verifies OTP, creates account, sends welcome email
 * 
 * LOGIN:
 *   1. POST /api/auth/login → validates email+password, sends OTP email
 *   2. POST /api/auth/verify-otp → verifies OTP, sends login notification email
 */

const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const emailService = require('../services/emailService');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'amazon_clone_jwt_secret_key_2026_sde_assignment';

/**
 * POST /api/auth/register — Step 1: Validate and send OTP.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, mobile, secondaryEmail, addressLine, city, state, pincode } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }

    // Check duplicate email
    const exists = await userModel.emailExists(email);
    if (exists) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    // Store registration data temporarily and send OTP
    const tempData = { name, email, password, mobile, secondaryEmail, addressLine, city, state, pincode };
    const code = await otpModel.createOTP(email, 'REGISTER', tempData);

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, code, 'REGISTER');

    return res.status(200).json({
      success: true,
      otpSent: true,
      email,
      message: 'OTP sent to your email. Please verify to complete registration.',
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login — Step 1: Validate credentials and send OTP.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    // Verify email exists and password is correct
    const userResult = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Credentials valid — send OTP
    const code = await otpModel.createOTP(email, 'LOGIN');
    const emailResult = await emailService.sendOTPEmail(email, code, 'LOGIN');

    return res.status(200).json({
      success: true,
      otpSent: true,
      email,
      message: 'OTP sent to your email. Please verify to sign in.',
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp — Step 2: Verify OTP and complete auth.
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, code, purpose } = req.body;

    if (!email || !code || !purpose) {
      return res.status(400).json({ success: false, error: 'Email, code, and purpose are required.' });
    }

    // Verify OTP
    const otp = await otpModel.verifyOTP(email, code, purpose);
    if (!otp) {
      return res.status(401).json({ success: false, error: 'Invalid or expired OTP. Please try again.' });
    }

    if (purpose === 'REGISTER') {
      // Create the user account from temp data
      const tempData = otp.temp_data;
      const { user, token } = await userModel.createUser(tempData);

      // Send welcome email (async, don't block response)
      emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);

      return res.status(201).json({
        success: true,
        data: { user, token },
      });
    } else if (purpose === 'LOGIN') {
      // Get user and generate token
      const userResult = await pool.query(
        `SELECT id, name, email, mobile, secondary_email, address_line, city, state, pincode, created_at
         FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }

      const user = userResult.rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Send login notification (async, don't block response)
      emailService.sendLoginNotification(user.email, user.name).catch(console.error);

      return res.status(200).json({
        success: true,
        data: { user, token },
      });
    }

    return res.status(400).json({ success: false, error: 'Invalid purpose.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp — Resend OTP for the same email+purpose.
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({ success: false, error: 'Email and purpose are required.' });
    }

    // For register, fetch temp data from last OTP
    let tempData = null;
    if (purpose === 'REGISTER') {
      const result = await pool.query(
        `SELECT temp_data FROM otp_codes WHERE email = $1 AND purpose = 'REGISTER' ORDER BY created_at DESC LIMIT 1`,
        [email]
      );
      if (result.rows.length > 0) {
        tempData = result.rows[0].temp_data;
      }
    }

    const code = await otpModel.createOTP(email, purpose, tempData);
    const emailResult = await emailService.sendOTPEmail(email, code, purpose);

    return res.status(200).json({
      success: true,
      otpSent: true,
      email,
      message: 'New OTP sent to your email.',
      previewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me — Returns the current user's profile (requires auth).
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, verifyOTP, resendOTP, getProfile };

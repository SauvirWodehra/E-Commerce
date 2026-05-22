/**
 * Auth Routes
 * 
 * POST /api/auth/register    - Step 1: Validate & send OTP
 * POST /api/auth/login        - Step 1: Check credentials & send OTP
 * POST /api/auth/verify-otp   - Step 2: Verify OTP & complete auth
 * POST /api/auth/resend-otp   - Resend OTP
 * GET  /api/auth/me           - Get current user profile (protected)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;

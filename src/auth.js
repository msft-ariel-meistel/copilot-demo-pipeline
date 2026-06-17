const express = require('express');
const router = express.Router();

// NOTE: No rate limiting on these endpoints — this is the bug Demo 4 fixes.
// The cloud agent will add the RateLimiter middleware from middleware/rateLimiter.js

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'email and password are required'
    });
  }

  // Mock auth — in production this would check the database
  if (email === 'demo@example.com' && password === 'demo123') {
    return res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    error: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password'
  });
});

/**
 * POST /api/auth/reset-password
 * Request a password reset email
 */
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_EMAIL',
      message: 'email is required'
    });
  }

  // Always return success (don't reveal if email exists)
  res.json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.'
  });
});

module.exports = router;

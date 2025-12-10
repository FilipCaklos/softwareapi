const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB in production)
const accounts = new Map();

/**
 * GET /api/subscription/:userId
 * Get subscription days remaining for a user
 * Returns: { userId, daysRemaining, expiryDate, status }
 */
app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists in local database
    if (!accounts.has(userId)) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = accounts.get(userId);
    const expiryDate = new Date(user.expiryDate);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      userId,
      email: user.email,
      daysRemaining: Math.max(0, daysRemaining),
      expiryDate: expiryDate.toISOString(),
      status: daysRemaining > 0 ? 'active' : 'expired',
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/create-account
 * Create a new account (can be called from Vercel function)
 * Body: { email, password, subscriptionDays }
 * Returns: { userId, email, daysRemaining, expiryDate }
 */
app.post('/api/auth/create-account', async (req, res) => {
  try {
    const { email, password, subscriptionDays = 30 } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email already exists
    for (let user of accounts.values()) {
      if (user.email === email) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Generate userId
    const { v4: uuidv4 } = require('uuid');
    const userId = uuidv4();

    // Hash password (simplified - use bcryptjs in production)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + subscriptionDays);

    // Store account
    accounts.set(userId, {
      userId,
      email,
      password: hashedPassword,
      subscriptionDays,
      expiryDate: expiryDate.toISOString(),
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      userId,
      email,
      daysRemaining: subscriptionDays,
      expiryDate: expiryDate.toISOString(),
      message: 'Account created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 * Returns: { userId, email, daysRemaining }
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    let foundUser = null;
    let foundUserId = null;

    for (let [userId, user] of accounts.entries()) {
      if (user.email === email) {
        foundUser = user;
        foundUserId = userId;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Calculate days remaining
    const expiryDate = new Date(foundUser.expiryDate);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      userId: foundUserId,
      email: foundUser.email,
      daysRemaining: Math.max(0, daysRemaining),
      expiryDate: foundUser.expiryDate,
      status: daysRemaining > 0 ? 'active' : 'expired'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

/**
 * POST /api/subscription/extend
 * Extend subscription for a user
 * Body: { userId, additionalDays }
 * Returns: { userId, newExpiryDate, daysRemaining }
 */
app.post('/api/subscription/extend', async (req, res) => {
  try {
    const { userId, additionalDays = 30 } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!accounts.has(userId)) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = accounts.get(userId);
    const expiryDate = new Date(user.expiryDate);
    expiryDate.setDate(expiryDate.getDate() + additionalDays);

    user.expiryDate = expiryDate.toISOString();

    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      userId,
      newExpiryDate: expiryDate.toISOString(),
      daysRemaining: Math.max(0, daysRemaining)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error extending subscription',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Subscription Service running on port ${PORT}`);
});

import { createAccount, getDaysRemaining } from './_db.js';

/**
 * Vercel Serverless Function - Create Account (Standalone)
 * POST /api/create-account
 * Body: { email, password, subscriptionDays }
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Create account using shared database
    const result = createAccount(email, password, subscriptionDays);
    
    if (result.error) {
      return res.status(409).json({
        success: false,
        message: result.error
      });
    }

    const { account } = result;
    const daysRemaining = getDaysRemaining(account.expiryDate);

    res.status(201).json({
      success: true,
      userId: account.userId,
      email: account.email,
      daysRemaining,
      expiryDate: account.expiryDate,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Error creating account:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
}

import { getAccountByEmail, verifyPassword, getDaysRemaining } from './_db.js';

/**
 * Vercel Serverless Function - Login (Standalone)
 * POST /api/login
 * Body: { email, password }
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const account = getAccountByEmail(email);

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    if (!verifyPassword(account.password, password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Calculate days remaining
    const daysRemaining = getDaysRemaining(account.expiryDate);
    const status = daysRemaining > 0 ? 'active' : 'expired';

    res.status(200).json({
      success: true,
      userId: account.userId,
      email: account.email,
      daysRemaining,
      expiryDate: account.expiryDate,
      status
    });
  } catch (error) {
    console.error('Error during login:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
}

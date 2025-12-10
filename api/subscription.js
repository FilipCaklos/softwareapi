import { getAccountById, getDaysRemaining } from './_db.js';

/**
 * Vercel Serverless Function - Get Subscription (Standalone)
 * GET /api/subscription?userId=<userId>
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

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get account from database
    const account = getAccountById(userId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
      status,
      createdAt: account.createdAt
    });
  } catch (error) {
    console.error('Error fetching subscription:', error.message);

    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message
    });
  }
}

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';

/**
 * Vercel Serverless Function - Create Account
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

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Call the main API service to create account
    const response = await axios.post(`${API_URL}/api/auth/create-account`, {
      email,
      password,
      subscriptionDays
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating account:', error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
}

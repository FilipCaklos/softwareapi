// Shared in-memory database for Vercel serverless functions
// Note: Data persists only within the same serverless instance
// For production, use a real database (MongoDB, PostgreSQL, etc.)

export const accounts = new Map();

export function createAccount(email, password, subscriptionDays = 30) {
  // Check if email exists
  for (let user of accounts.values()) {
    if (user.email === email) {
      return { error: 'Email already registered' };
    }
  }

  const userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const hashedPassword = Buffer.from(password).toString('base64');
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + subscriptionDays);

  const account = {
    userId,
    email,
    password: hashedPassword,
    subscriptionDays,
    expiryDate: expiryDate.toISOString(),
    createdAt: new Date().toISOString()
  };

  accounts.set(userId, account);
  return { success: true, account };
}

export function getAccountById(userId) {
  return accounts.get(userId);
}

export function getAccountByEmail(email) {
  for (let [userId, user] of accounts.entries()) {
    if (user.email === email) {
      return { userId, ...user };
    }
  }
  return null;
}

export function verifyPassword(stored, provided) {
  const hashedProvided = Buffer.from(provided).toString('base64');
  return stored === hashedProvided;
}

export function getDaysRemaining(expiryDate) {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export function extendSubscription(userId, additionalDays) {
  const account = accounts.get(userId);
  if (!account) {
    return { error: 'User not found' };
  }

  const expiryDate = new Date(account.expiryDate);
  expiryDate.setDate(expiryDate.getDate() + additionalDays);
  account.expiryDate = expiryDate.toISOString();

  return { success: true, expiryDate: expiryDate.toISOString() };
}

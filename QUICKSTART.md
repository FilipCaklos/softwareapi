# Quick Start Guide

## 1. Start Backend Server

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:5000`

## 2. Start Client Application

```bash
cd client
npm install
npm start
```

Client runs on `http://localhost:3000`

## 3. Create Test Account

In the browser:
1. Go to `http://localhost:3000`
2. Click "Create one here"
3. Register with:
   - Email: `test@example.com`
   - Password: `password123`
   - Subscription Days: `30`
4. Click "Create Account"

## 4. View Dashboard

After registration, you'll see your subscription dashboard with:
- Days remaining
- Expiry date
- Option to extend subscription

## 5. Login

Close browser or click logout, then login with your credentials.

## Testing the API Directly

```bash
# Create account
curl -X POST http://localhost:5000/api/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","subscriptionDays":30}'

# Login (replace with response userId)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get subscription (use userId from login response)
curl http://localhost:5000/api/subscription/YOUR_USER_ID

# Extend subscription
curl -X POST http://localhost:5000/api/subscription/extend \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID","additionalDays":30}'
```

## Deploying to Vercel

### Deploy Backend
```bash
cd server
npm install -g vercel
vercel --prod
# Note the URL
```

### Deploy Client
```bash
cd client
# Edit .env for production
REACT_APP_API_URL=https://your-server-url.vercel.app
vercel --prod
```

### Deploy Functions
```bash
cd api
vercel --prod
```

That's it! Your subscription service is now live.

# Vercel Configuration

This folder contains serverless functions for Vercel deployment.

## Files

- `create-account.js` - POST endpoint for creating new accounts
- `subscription.js` - GET endpoint for retrieving subscription info
- `login.js` - POST endpoint for user login
- `vercel.json` - Vercel project configuration

## Deployment

```bash
cd api
vercel --prod
```

## Environment Variables

Set these in Vercel dashboard under Project Settings → Environment Variables:

```
API_URL=https://your-backend-api.vercel.app
```

## API Base URL

After deployment, your functions will be available at:

```
https://your-project.vercel.app/api/
```

### Endpoints

- `POST /api/create-account` - Create new account
- `GET /api/subscription?userId=<id>` - Get subscription info
- `POST /api/login` - Login user

## CORS

All functions have CORS enabled for production use.

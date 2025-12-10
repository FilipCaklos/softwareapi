# Subscription Service

A complete subscription management system with account generation, subscription tracking, and a modern React client. Features API service, Vercel serverless functions, and an interactive web interface.

## Project Structure

```
subscription-service/
├── server/                 # Express.js backend API
│   ├── index.js           # Main server file
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment variables template
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main app component
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Styles
│   ├── public/           # Static files
│   ├── package.json      # Dependencies
│   └── .env.example      # Environment variables template
├── api/                   # Vercel serverless functions
│   ├── create-account.js # Account creation endpoint
│   ├── subscription.js   # Subscription lookup endpoint
│   ├── login.js          # Login endpoint
│   └── vercel.json       # Vercel configuration
└── README.md             # This file
```

## Features

### Backend API (Express.js)
- **Account Creation**: Create new user accounts with subscription periods
- **Subscription Lookup**: Get remaining subscription days and expiry date
- **User Authentication**: Login with email and password (hashed with bcryptjs)
- **Subscription Extension**: Extend existing subscriptions
- **RESTful API**: Organized endpoints for all operations

### Vercel Serverless Functions
- **Account Creation Function**: Serverless endpoint for creating accounts
- **Subscription Lookup**: Serverless endpoint for checking subscription status
- **Login Function**: Serverless login endpoint
- **CORS Enabled**: Ready for production use

### React Client
- **Registration Page**: Create new accounts with subscription period selection
- **Login Page**: Authenticate with email and password
- **Dashboard**: View subscription details, days remaining, and expiry date
- **Extension**: Extend subscriptions directly from the dashboard
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Persists user session

## Installation

### 1. Backend Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
VERCEL_API_URL=https://your-vercel-domain.vercel.app
```

Start the server:
```bash
npm start          # Production
npm run dev        # Development (requires nodemon)
```

### 2. React Client

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

Start the client:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Local Development (Port 5000)

#### Account Management
- **POST** `/api/auth/create-account`
  - Create a new account
  - Body: `{ email, password, subscriptionDays }`
  - Response: `{ userId, email, daysRemaining, expiryDate }`

- **POST** `/api/auth/login`
  - Login user
  - Body: `{ email, password }`
  - Response: `{ userId, email, daysRemaining, expiryDate, status }`

#### Subscription Management
- **GET** `/api/subscription/:userId`
  - Get subscription info for user
  - Response: `{ userId, email, daysRemaining, expiryDate, status, createdAt }`

- **POST** `/api/subscription/extend`
  - Extend subscription
  - Body: `{ userId, additionalDays }`
  - Response: `{ userId, newExpiryDate, daysRemaining }`

#### Health Check
- **GET** `/health`
  - Check server status
  - Response: `{ status: "Server is running" }`

## Vercel Deployment

### Prerequisites
- Vercel account (free: https://vercel.com)
- Node.js installed locally

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd server
   vercel
   ```
   - Follow prompts
   - Note the deployment URL

3. **Deploy Client**
   ```bash
   cd client
   ```
   
   Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-vercel-backend.vercel.app
   ```
   
   ```bash
   vercel --prod
   ```

4. **Deploy Serverless Functions**
   ```bash
   cd api
   vercel --prod
   ```

5. **Update Environment Variables**
   - Go to Vercel Dashboard
   - Select your projects
   - Add environment variables:
     - `API_URL`: Your backend URL
     - `VERCEL_API_URL`: Your API functions URL

## Usage

### Register New Account
1. Open client app
2. Click "Create one here" to go to registration
3. Enter email, password, and choose subscription days
4. Click "Create Account"
5. You'll be logged in and redirected to dashboard

### Login
1. Open client app
2. Enter email and password
3. Click "Login"
4. View your subscription dashboard

### Check Subscription
1. After login, view subscription info on dashboard:
   - Days remaining
   - Expiry date
   - Account status

### Extend Subscription
1. On dashboard, select additional days
2. Click "Extend Subscription"
3. Subscription will be extended immediately

## Technology Stack

### Backend
- **Express.js**: Web framework
- **Axios**: HTTP client
- **bcryptjs**: Password hashing
- **UUID**: Unique ID generation
- **CORS**: Cross-origin support
- **dotenv**: Environment variables

### Frontend
- **React 18**: UI framework
- **Axios**: API communication
- **React Router**: Navigation
- **CSS3**: Styling

### Infrastructure
- **Vercel**: Serverless hosting
- **Node.js**: Runtime environment

## Security Considerations

⚠️ **For Production Use:**

1. **Database**: Replace in-memory Map with a real database (MongoDB, PostgreSQL, etc.)
2. **Password Storage**: Already using bcryptjs - ensure proper configuration
3. **Authentication**: Implement JWT tokens instead of session storage
4. **HTTPS**: All endpoints must use HTTPS in production
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks
6. **Input Validation**: Enhance validation for all inputs
7. **Secrets Management**: Use environment variables for sensitive data
8. **Database Encryption**: Encrypt sensitive data at rest

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
VERCEL_API_URL=https://your-vercel-domain.vercel.app
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Vercel Functions
```
API_URL=https://your-backend-api.vercel.app
```

## Troubleshooting

### CORS Errors
- Ensure API_URL in client matches server URL
- Check server is running on correct port
- Verify CORS middleware is enabled

### Account Creation Fails
- Check email format is valid
- Ensure password is at least 6 characters
- Verify email isn't already registered

### Subscription Data Not Showing
- Ensure user is logged in
- Check browser console for errors
- Verify API is running and accessible

### Vercel Deployment Issues
- Ensure `api/` folder is at root level
- Check environment variables are set
- Review Vercel deployment logs

## API Testing with cURL

```bash
# Create account
curl -X POST http://localhost:5000/api/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","subscriptionDays":30}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get subscription
curl http://localhost:5000/api/subscription/{userId}

# Extend subscription
curl -X POST http://localhost:5000/api/subscription/extend \
  -H "Content-Type: application/json" \
  -d '{"userId":"{userId}","additionalDays":30}'
```

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions, please check the troubleshooting section or review the code comments.

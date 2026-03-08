# Railway Environment Variables Configuration

## Required Environment Variables for Railway Deployment

Add these environment variables in your Railway project settings:

### CORS Configuration
```
CORS_ORIGINS=http://localhost:3000,https://face-recognition-attendance-system-nine-chi.vercel.app
```

### Flask Configuration
```
FLASK_ENV=production
PORT=5001
```

### Face Recognition Settings
```
FACE_THRESHOLD=0.5
```

### Firebase Configuration
```
FIREBASE_PROJECT_ID=user-login-data-7d185
```

## How to Add Environment Variables in Railway:

1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable with its value
5. Click "Deploy" to apply changes

## Important Notes:

- The CORS_ORIGINS must include your Vercel frontend URL
- Make sure FLASK_ENV is set to "production" for production deployment
- The PORT variable should match Railway's assigned port (usually 5001)
- Firebase credentials should be added as a service account JSON file

## Verification:

After deployment, check the logs to ensure:
- ✓ CORS is configured correctly
- ✓ Firebase connection is established
- ✓ Face recognition model is loaded
- ✓ Server is running on the correct port

import os

class Config:
    # Flask settings
    DEBUG = os.getenv('FLASK_ENV', 'development') != 'production'
    HOST = '0.0.0.0'
    PORT = int(os.getenv('PORT', 5001))
    
    # CORS settings - Support Railway/Vercel
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,https://face-recognition-attendance-system-nine-chi.vercel.app').split(',')
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    CORS_HEADERS = ['Content-Type', 'Authorization', 'Accept']
    
    # Face recognition settings
    FACE_RECOGNITION_THRESHOLD = float(os.getenv('FACE_THRESHOLD', '0.5'))
    
    # Firebase settings
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID', 'user-login-data-7d185')
    FIREBASE_STORAGE_BUCKET = os.getenv('FIREBASE_STORAGE_BUCKET', 'user-login-data-7d185-firebase-adminsdk-fbsvc-5e534dfaf3.json')
    
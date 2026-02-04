import os

class Config:
    # Flask settings
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5001
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000']
    CORS_METHODS = ['GET', 'POST', 'OPTIONS']
    CORS_HEADERS = ['Content-Type']
    
    # Face recognition settings
    FACE_RECOGNITION_THRESHOLD = 0.5
    
    # Dataset path
    AI_DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ai', 'image_dataset')
    
    # Firebase settings
    FIREBASE_PROJECT_ID = 'user-login-data-7d185'
    FIREBASE_STORAGE_BUCKET = 'user-login-data-7d185-firebase-adminsdk-fbsvc-5e534dfaf3.json'
    
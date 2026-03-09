from flask import Flask
from flask_cors import CORS
import sys
import os

# Add AI module to path
ai_path = os.path.join(os.path.dirname(__file__), '..', '..')
sys.path.insert(0, ai_path)
from ai.firebase_face_model import FirebaseFaceModel

from .config.settings import Config
from .routes.face_routes import init_face_routes
from .routes.common_routes import init_common_routes
from .routes.detection_routes import init_detection_routes

def create_app(enhanced=False):
    app = Flask(__name__)
    
    # Configure CORS with proper settings
    CORS(app, 
         origins=Config.CORS_ORIGINS,
         methods=Config.CORS_METHODS,
         allow_headers=Config.CORS_HEADERS,
         supports_credentials=True,
         expose_headers=['Content-Type', 'Authorization'])
    
    # Initialize Firebase-first face recognition model
    face_model = FirebaseFaceModel()
    
    # Load encodings from Firebase
    if not face_model.load_from_firebase():
        print("Warning: No encodings loaded from Firebase")
    
    # Cache for storing face encodings
    encoding_cache = {}
    
    init_face_routes(app, face_model, encoding_cache)
    init_common_routes(app, encoding_cache if enhanced else None)
    init_detection_routes(app)
    return app, face_model, encoding_cache
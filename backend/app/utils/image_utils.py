"""Image processing utilities for face recognition."""
import base64
import face_recognition
import numpy as np
from PIL import Image
import io
import hashlib

def get_face_encoding_from_base64(image_data, cache_key=None, encoding_cache=None):
    """Extract face encoding from base64 image with caching"""
    try:
        if cache_key and encoding_cache and cache_key in encoding_cache:
            return encoding_cache[cache_key]
        
        # Decode image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        
        # Direct conversion to numpy array (faster than PIL)
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Upscale small images (common on mobile) to improve face detection
        w, h = image.size
        if w < 640 or h < 480:
            scale = max(640 / w, 480 / h)
            image = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
        
        image_array = np.array(image)
        
        # Try with upscaling first (better for mobile photos), fallback to normal
        face_locations = face_recognition.face_locations(image_array, number_of_times_to_upsample=2, model='hog')
        face_encodings = face_recognition.face_encodings(image_array, known_face_locations=face_locations, model='large') if face_locations else []
        
        if len(face_encodings) == 0:
            face_encodings = face_recognition.face_encodings(image_array, model='large')
        
        if len(face_encodings) == 0:
            print("Warning: No face detected in image")
            return None
        
        if len(face_encodings) > 1:
            print(f"Warning: Multiple faces detected ({len(face_encodings)}), using first face")
        
        encoding = face_encodings[0]
        
        # Cache the encoding if cache_key provided
        if cache_key and encoding_cache is not None:
            encoding_cache[cache_key] = encoding
        
        return encoding
    except Exception as e:
        print(f"Error in get_face_encoding_from_base64: {str(e)}")
        return None

def create_cache_key(image_data):
    """Create a hash key for caching"""
    return hashlib.md5(image_data.encode()).hexdigest()
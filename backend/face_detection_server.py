from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

def decode_base64_image(base64_string):
    """Decode base64 image to OpenCV format"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        
        # Decode image
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return image
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

@app.route('/detect-face', methods=['POST'])
def detect_face():
    """Detect faces in uploaded image"""
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode image
        image = decode_base64_image(data['image'])
        
        if image is None:
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Load face cascade classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        # Analyze results
        if len(faces) == 0:
            return jsonify({
                'success': False,
                'face_detected': False,
                'face_count': 0,
                'message': 'No face detected'
            })
        elif len(faces) > 1:
            return jsonify({
                'success': False,
                'face_detected': True,
                'face_count': len(faces),
                'error_type': 'multiple_faces',
                'message': f'Multiple faces detected ({len(faces)}). Please ensure only one person is in the frame.'
            })
        else:
            return jsonify({
                'success': True,
                'face_detected': True,
                'face_count': 1,
                'message': 'Single face detected successfully'
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'Face Detection Server is running',
        'endpoints': {
            'health': '/health',
            'detect_face': '/detect-face (POST)'
        },
        'port': 5000
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'Face detection server is running'})

if __name__ == '__main__':
    print("Starting Face Detection Server on port 5000...")
    app.run(debug=True, host='0.0.0.0', port=5000)
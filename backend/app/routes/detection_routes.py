import cv2
import numpy as np
from flask import request, jsonify
import base64
import io
from PIL import Image

def init_detection_routes(app):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml') # type: ignore

    @app.route('/detect_face', methods=['POST'])
    def detect_face():
        try:
            data = request.get_json()

            if not data or 'image' not in data:
                return jsonify({'error': 'No image provided'}), 400

            image_data = data['image'].split(',')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))

            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)

            faces = face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(60, 60)
            )

            face_count = len(faces)
            
            if face_count == 0:
                return jsonify({
                    'success': False,
                    'error_type': 'no_face',
                    'message': 'No face detected',
                    'face_count': 0
                })
            elif face_count > 1:
                return jsonify({
                    'success': False,
                    'error_type': 'multiple_faces',
                    'message': 'Multiple faces detected. Only one person allowed.',
                    'face_count': face_count
                })
            else:
                return jsonify({
                    'success': True,
                    'face_detected': True,
                    'face_count': 1
                })
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
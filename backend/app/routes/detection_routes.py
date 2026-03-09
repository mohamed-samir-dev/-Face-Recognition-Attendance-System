"""Face detection routes for real-time face validation."""
# pylint: disable=import-error
import base64
import io

import cv2
import numpy as np
from flask import request, jsonify
from PIL import Image
import face_recognition

def init_detection_routes(app):
    """Initialize face detection routes."""
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml') # type: ignore

    @app.route('/detect_face', methods=['POST'])
    def detect_face():
        """Detect faces in uploaded image and validate single face presence."""
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
        
        except (ValueError, KeyError, base64.binascii.Error):
            return jsonify({'error': 'Invalid image data'}), 400
        except (IOError, OSError):
            return jsonify({'error': 'Image processing failed'}), 500

    @app.route('/detect_faces_realtime', methods=['POST'])
    def detect_faces_realtime():
        """Detect faces in real-time and return face locations for drawing boxes."""
        try:
            data = request.get_json()
            if not data or 'image' not in data:
                return jsonify({'error': 'No image provided'}), 400

            image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image_array = np.array(image)
            
            # Use face_recognition library for better accuracy
            face_locations = face_recognition.face_locations(image_array, model='hog')
            
            face_count = len(face_locations)
            
            # Convert face locations to format: {x, y, width, height}
            faces = []
            for (top, right, bottom, left) in face_locations:
                faces.append({
                    'x': left,
                    'y': top,
                    'width': right - left,
                    'height': bottom - top
                })
            
            return jsonify({
                'success': True,
                'face_count': face_count,
                'faces': faces,
                'can_capture': face_count == 1
            })
        
        except (ValueError, KeyError, base64.binascii.Error):
            return jsonify({'error': 'Invalid image data'}), 400
        except (IOError, OSError):
            return jsonify({'error': 'Image processing failed'}), 500
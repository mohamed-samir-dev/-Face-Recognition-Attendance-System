from flask import request, jsonify
import os
import base64
import tempfile
import face_recognition
from ..utils.image_utils import get_face_encoding_from_base64, create_cache_key
from ..services.firebase_service import FirebaseService

def init_face_routes(app, face_model, encoding_cache):
    firebase_service = FirebaseService()
    
    @app.route('/recognize', methods=['POST'])
    def recognize_face():
        """Two-step authentication: face recognition + numericId validation"""
        try:
            data = request.get_json()
            
            if 'image' not in data:
                return jsonify({'error': 'No image provided'}), 400
            
            expected_numeric_id = data.get('expected_numeric_id')
            
            if not expected_numeric_id:
                return jsonify({
                    'error': 'Numeric ID required for authentication'
                }), 400
            
            image_data = data['image'].split(',')[1]
            image_bytes = base64.b64decode(image_data)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(image_bytes)
                temp_path = temp_file.name
            
            try:
                recognized_name, recognition_message = face_model.recognize_face(temp_path)
                
                if not recognized_name:
                    return jsonify({
                        'success': False,
                        'step_failed': 'face_recognition',
                        'message': recognition_message or 'Face not recognized'
                    })
                
                if firebase_service.firebase_enabled:
                    try:
                        users_ref = firebase_service.db.collection('users')
                        query = users_ref.where('name', '==', recognized_name)
                        docs = query.get()
                        
                        firebase_user = None
                        for doc in docs:
                            firebase_user = doc.to_dict()
                            break
                        
                        if not firebase_user:
                            return jsonify({
                                'success': False,
                                'step_failed': 'firebase_lookup',
                                'message': f'User "{recognized_name}" not found in Firebase'
                            })
                        
                        firebase_numeric_id = firebase_user.get('numericId')
                        if firebase_numeric_id != expected_numeric_id:
                            return jsonify({
                                'success': False,
                                'step_failed': 'numeric_id_verification',
                                'message': f'Numeric ID mismatch'
                            })
                        
                        return jsonify({
                            'success': True,
                            'message': f'Authentication successful for {recognized_name}',
                            'recognized_name': recognized_name,
                            'verified_numeric_id': firebase_numeric_id
                        })
                        
                    except Exception as firebase_error:
                        return jsonify({
                            'success': False,
                            'step_failed': 'firebase_error',
                            'message': f'Firebase verification failed: {str(firebase_error)}'
                        })
                else:
                    return jsonify({
                        'success': False,
                        'step_failed': 'firebase_disabled',
                        'message': 'Firebase is disabled'
                    })
            
            finally:
                os.unlink(temp_path)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/three-step-verify', methods=['POST'])
    def three_step_verify():
        """Two-step authentication endpoint"""
        try:
            data = request.get_json()
            
            if 'image' not in data:
                return jsonify({'error': 'No image provided'}), 400
            
            expected_numeric_id = data.get('expected_numeric_id')
            
            if not expected_numeric_id:
                return jsonify({'error': 'Numeric ID required'}), 400
            
            image_data = data['image'].split(',')[1]
            image_bytes = base64.b64decode(image_data)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(image_bytes)
                temp_path = temp_file.name
            
            try:
                recognized_name, message = face_model.recognize_face(temp_path)
                
                verification_result = {
                    'step1_face_recognition': {
                        'success': bool(recognized_name),
                        'recognized_name': recognized_name,
                        'message': message
                    },
                    'step2_numeric_id_verification': {'success': False},
                    'overall_success': False
                }
                
                if not recognized_name:
                    verification_result['error'] = 'Face not recognized'
                    return jsonify(verification_result)
                
                if firebase_service.firebase_enabled:
                    try:
                        users_ref = firebase_service.db.collection('users')
                        query = users_ref.where('name', '==', recognized_name)
                        docs = query.get()
                        
                        firebase_user = None
                        for doc in docs:
                            firebase_user = doc.to_dict()
                            break
                        
                        if firebase_user:
                            firebase_numeric_id = firebase_user.get('numericId')
                            
                            if firebase_numeric_id is None or expected_numeric_id is None:
                                numeric_id_match = False
                            else:
                                firebase_id_str = str(firebase_numeric_id).strip()
                                expected_id_str = str(expected_numeric_id).strip()
                                numeric_id_match = firebase_id_str == expected_id_str
                                
                                if not numeric_id_match:
                                    try:
                                        numeric_id_match = int(firebase_numeric_id) == int(expected_numeric_id)
                                    except (ValueError, TypeError):
                                        pass
                            
                            verification_result['step2_numeric_id_verification'] = {
                                'success': numeric_id_match,
                                'firebase_numeric_id': firebase_numeric_id,
                                'expected_numeric_id': expected_numeric_id,
                                'message': 'IDs match' if numeric_id_match else 'ID mismatch'
                            }
                            
                            if numeric_id_match:
                                verification_result['overall_success'] = True
                                verification_result['message'] = f'Authentication successful for {recognized_name}'
                            else:
                                verification_result['error'] = 'Numeric ID verification failed'
                        else:
                            verification_result['step2_numeric_id_verification'] = {
                                'success': False,
                                'message': f'User not found in Firebase'
                            }
                            verification_result['error'] = 'User not found'
                    except Exception as firebase_error:
                        verification_result['step2_numeric_id_verification'] = {
                            'success': False,
                            'message': f'Firebase error: {str(firebase_error)}'
                        }
                        verification_result['error'] = 'Firebase error'
                else:
                    verification_result['step2_numeric_id_verification'] = {
                        'success': False,
                        'message': 'Firebase disabled'
                    }
                    verification_result['error'] = 'Firebase disabled'
                
                return jsonify(verification_result)
            
            finally:
                os.unlink(temp_path)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/compare', methods=['POST', 'OPTIONS'])
    def compare_faces():
        if request.method == 'OPTIONS':
            return '', 200
        """Legacy compare endpoint - kept for backward compatibility"""
        try:
            data = request.get_json()
            
            if 'image1' not in data or 'image2' not in data:
                return jsonify({'error': 'Two images required'}), 400
            
            # Create cache keys for stored images (image2 is usually the stored user photo)
            image2_hash = create_cache_key(data['image2'])
            
            # Get encodings with caching for stored image
            face1_encoding = get_face_encoding_from_base64(data['image1'])
            face2_encoding = get_face_encoding_from_base64(data['image2'], cache_key=image2_hash, encoding_cache=encoding_cache)
            
            if face1_encoding is None or face2_encoding is None:
                return jsonify({
                    'match': False,
                    'message': 'No face detected in one or both images'
                })
            
            # Calculate distance (lower = more similar)
            distance = face_recognition.face_distance([face2_encoding], face1_encoding)[0]
            
            # STRICT threshold to prevent cross-employee fraud
            threshold = 0.45
            match = distance < threshold
            
            return jsonify({
                'match': bool(match),
                'distance': float(distance),
                'threshold': float(threshold),
                'message': 'Faces match' if match else 'Faces do not match'
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/retrain', methods=['POST'])
    def retrain_model():
        try:
            face_model.reload()
            return jsonify({'success': True, 'message': 'Model reloaded from Firebase'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/add-employee', methods=['POST'])
    def add_employee():
        """Add new employee with face encoding to Firebase"""
        try:
            data = request.get_json()
            name = data.get('name')
            numeric_id = data.get('numericId')
            image = data.get('image')
            
            if not all([name, numeric_id, image]):
                return jsonify({'error': 'Missing required fields'}), 400
            
            success, message = face_model.add_employee(name, numeric_id, image)
            
            if success:
                return jsonify({'success': True, 'message': message})
            else:
                return jsonify({'error': message}), 400
                
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/clear-cache', methods=['POST'])
    def clear_cache():
        """Clear the encoding cache to free memory"""
        cache_size = len(encoding_cache)
        encoding_cache.clear()
        return jsonify({'message': f'Cache cleared. Removed {cache_size} entries'})
    

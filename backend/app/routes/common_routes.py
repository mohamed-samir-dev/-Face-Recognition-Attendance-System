"""Common routes for health checks and basic endpoints."""
from flask import jsonify  # pylint: disable=import-error
def init_common_routes(app, encoding_cache=None):
    """Initialize common routes for health checks and basic endpoints."""

    @app.route('/health', methods=['GET'])
    def health_check():
        cache_info = {'cache_size': len(encoding_cache)} if encoding_cache else {}
        return jsonify({'status': 'healthy', **cache_info})

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Face Recognition Server is running', 'port': 5001})

    @app.route('/favicon.ico')
    def favicon():
        return '', 204
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.server_factory import create_app
from app.config.settings import Config

app, face_model, encoding_cache = create_app(enhanced=True)

if __name__ == '__main__':
    print(f"Starting Enhanced Face Recognition Server on port {Config.PORT}...")
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)
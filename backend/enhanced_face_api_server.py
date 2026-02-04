from app.server_factory import create_app
from app.config.settings import Config
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

app, face_model, encoding_cache = create_app(enhanced=True)

if __name__ == '__main__':
    print(f"Starting Enhanced Face Recognition Server on port {Config.PORT}...")
    print(f"Encoding cache initialized")
    app.run(debug=Config.DEBUG, host=Config.HOST, port=Config.PORT)
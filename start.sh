#!/bin/sh
echo "Starting server on PORT=$PORT"
exec gunicorn --chdir backend --bind 0.0.0.0:$PORT --timeout 120 --workers 1 --log-level debug enhanced_face_api_server:app

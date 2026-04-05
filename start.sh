#!/bin/sh
exec gunicorn --chdir backend --bind 0.0.0.0:$PORT --timeout 120 --workers 1 enhanced_face_api_server:app

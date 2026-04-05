FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-all-dev \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir "pip==24.0" && \
    pip install --no-cache-dir "cmake==3.27.9" && \
    CMAKE_POLICY_VERSION_MINIMUM=3.5 pip install --no-cache-dir "dlib==19.24.6" && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "--chdir", "backend", "--bind", "0.0.0.0:5001", "--timeout", "120", "--workers", "1", "enhanced_face_api_server:app"]

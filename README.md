# IntelliAttend — AI-Powered Face Recognition Attendance System

> Graduation Project · Computer Science  
> A full-stack attendance management system that uses facial recognition to eliminate buddy-punching and automate HR workflows.

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Firebase Collections](#firebase-collections)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Diagrams](#diagrams)

---

## Overview

IntelliAttend replaces manual attendance registers and ID-card systems with a **two-step biometric authentication** flow:

1. **Face Recognition** — dlib 128-dimensional encoding compared against stored encodings (tolerance `0.45`, confidence threshold `55%`)
2. **Numeric ID Verification** — matched name is cross-checked against the employee's `numericId` in Firestore

Both steps must pass before an attendance record is written. This design prevents photo spoofing and buddy-punching simultaneously.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND  ·  Next.js 15 + TypeScript + Tailwind CSS        │
│  /login  /camera  /userData  /supervisor  /admin            │
│  src/lib/services  ←  all business logic                    │
└──────────────┬──────────────────────────┬───────────────────┘
               │  HTTP (face API calls)   │  Firestore SDK (direct)
               ▼                          ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│  BACKEND  ·  Flask   │    │  Firebase Firestore              │
│  port 5001           │    │  users · attendance              │
│  dlib 128D model     │    │  leaveRequests · settings        │
│  OpenCV HaarCascade  │    │  notifications · monitoring      │
│  FirebaseFaceModel   │    │  accessDeniedLogs · leaveDays    │
└──────────────────────┘    └──────────────────────────────────┘
               │
               ▼
┌──────────────────────┐
│  AI Module           │
│  ai/firebase_face_   │
│  model.py            │
│  loads encodings     │
│  from Firestore at   │
│  startup             │
└──────────────────────┘
```

---

## Features

### Authentication
- Username + password login
- Facial recognition login (`/face-login`) — no password required
- Device fingerprint binding — one device per user account
- Access denied logging with admin review panel
- Session management via `sessionStorage` + Firestore `sessionToken`

### Attendance
- Real-time camera feed with face detection preview
- Two-step verification before marking attendance
- Automatic late detection based on `workStartTime` setting
- Check-in / Check-out with worked hours and overtime calculation
- Live work timer on employee dashboard
- Absence auto-recording via scheduled service

### Leave Management
- Employee submits leave request → routed to department supervisor
- Supervisor/Manager requests → routed directly to Admin
- Approval updates employee status to `OnLeave`
- `StatusScheduler` component auto-restores `Active` when leave period ends

### Admin Panel
- Add employees with 3-photo face training (`/generate-encoding`)
- Edit employee profiles with automated email notification
- Department statistics and attendance analytics (Recharts)
- Leave request approval queue
- System settings (work hours, departments, late threshold)
- Access denied logs with device unlock capability
- Random monitoring snapshots

### Supervisor Panel
- Department team attendance overview
- Employee leave request approval
- Edit team member profiles

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 15.5.x |
| UI Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | Lucide React, Framer Motion | latest |
| Charts | Recharts | 3.x |
| Camera | react-webcam | 7.x |
| Email | Nodemailer | 7.x |
| Export | SheetJS (xlsx) | 0.20.3 |
| Backend Framework | Flask | 2.3.3 |
| CORS | Flask-CORS | 4.0.0 |
| Face Recognition | face-recognition (dlib) | 1.3.0 |
| Computer Vision | OpenCV | 4.8.1 |
| Image Processing | Pillow | 10.0.1 |
| Numerical | NumPy | 1.24.3 |
| Database | Firebase Firestore | 12.x SDK |
| Auth/Admin | Firebase Admin SDK | latest |
| Production Server | Gunicorn | latest |
| Containerization | Docker | — |
| Deployment | Railway (backend) · Vercel/Netlify (frontend) | — |

---

## Project Structure

```
-Face-Recognition-Attendance-System/
│
├── ai/
│   └── firebase_face_model.py        # FirebaseFaceModel — loads encodings, recognize_face()
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   │   └── settings.py           # Flask config (PORT, CORS, thresholds)
│   │   ├── routes/
│   │   │   ├── face_routes.py        # /recognize /three-step-verify /face-login /compare /generate-encoding
│   │   │   ├── detection_routes.py   # /detect_face (OpenCV HaarCascade)
│   │   │   └── common_routes.py      # /health /
│   │   ├── services/
│   │   │   └── firebase_service.py   # Firestore client, attendance recording, encoding storage
│   │   ├── utils/
│   │   │   └── image_utils.py        # base64 → encoding helpers, cache key
│   │   └── server_factory.py         # create_app() — wires Flask + CORS + FirebaseFaceModel + routes
│   ├── requirements/
│   │   └── requirements.txt
│   └── enhanced_face_api_server.py   # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Redirects → /login
│   │   │   ├── login/                # LoginPageContent — password & face login
│   │   │   ├── camera/               # CameraPageContent — attendance marking
│   │   │   ├── userData/             # Employee dashboard
│   │   │   ├── supervisor/           # Supervisor dashboard
│   │   │   ├── admin/                # Admin dashboard + add/edit employee
│   │   │   ├── leaveRequest/         # Leave request form
│   │   │   ├── profile/              # Profile management
│   │   │   └── api/                  # Next.js API routes (email sending)
│   │   ├── components/
│   │   │   ├── admin/                # Admin UI components (attendance, employees, reports, settings)
│   │   │   ├── supervisor/           # Supervisor UI components
│   │   │   ├── dashboard/            # Charts, widgets, profile cards
│   │   │   ├── common/               # Shared modals, buttons, liveness, notifications
│   │   │   └── layout/               # Navigation, sidebar layouts
│   │   ├── lib/
│   │   │   ├── firebase/config.ts    # Firestore initialization
│   │   │   ├── services/
│   │   │   │   ├── attendance/       # attendanceService, checkoutService, timerService, overtimeService
│   │   │   │   ├── auth/             # sessionService, threeStepAuthService, faceComparisonService
│   │   │   │   ├── leave/            # leaveService, leaveDaysService, leaveStatusService
│   │   │   │   ├── user/             # userService, statusService, passwordService, salaryService
│   │   │   │   └── system/           # settingsService, notificationService, emailService, monitoringService
│   │   │   ├── types/                # TypeScript interfaces (User, AttendanceRecord, LeaveRequest …)
│   │   │   └── utils/                # timeFormatters, imageOptimizer, geolocation, performanceMonitor
│   │   └── utils/
│   │       ├── faceDetection.ts
│   │       ├── faceRecognition.ts
│   │       └── statusHelpers.ts
│   ├── .env.local                    # Local environment variables
│   └── package.json
│
├── scripts/
│   └── migrate_to_firebase.py        # Data migration utility
│
├── Dockerfile                        # Production container (python:3.11-slim + dlib build)
├── start.sh                          # Gunicorn startup command
├── railway.json                      # Railway deployment config
├── FLOWCHART_DIAGRAM.html            # Interactive 7-tab system flowchart
├── DATA_FLOW_DIAGRAM.md              # DFD levels 0–2
└── ERD_DATABASE.md                   # Firebase collections ERD
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.9 – 3.11 |
| Node.js | 18+ |
| npm | 9+ |
| CMake | 3.x (for dlib build) |
| Git | any |

> **Windows users:** Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the "Desktop development with C++" workload before installing dlib.

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/face-recognition-attendance-system.git
cd face-recognition-attendance-system

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install cmake==3.27.9
pip install dlib==19.24.6
pip install -r backend/requirements/requirements.txt

# 4. Add your Firebase service account key
# Place the downloaded JSON file at the project root:
# user-login-data-<id>-firebase-adminsdk-<token>.json
# OR set the environment variable FIREBASE_CREDENTIALS_JSON (for cloud deployment)

# 5. Start the backend server
python backend/enhanced_face_api_server.py
# Server starts on http://localhost:5001
```

---

### Frontend Setup

```bash
# From the project root
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Fill in your Firebase config and backend URL (see Environment Variables section)

# Start development server
npm run dev
# App starts on http://localhost:3000
```

---

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Firestore Database** in Native mode.
3. Go to **Project Settings → Service Accounts** → Generate new private key → download JSON.
4. Place the JSON file at the project root (filename must match the path in `firebase_service.py`).
5. Copy your **Web App config** into `frontend/.env.local`.

Required Firestore collections are created automatically on first use. No manual schema setup needed.

---

## Environment Variables

### Frontend — `frontend/.env.local`

```env
# Backend
NEXT_PUBLIC_FACE_RECOGNITION_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase Web SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Email (Nodemailer — for credential emails)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Backend — Environment Variables (or set in shell)

```env
PORT=5001
FLASK_ENV=development
FACE_THRESHOLD=0.5
CORS_ORIGINS=http://localhost:3000
FIREBASE_PROJECT_ID=your_project_id

# For cloud deployment (replaces JSON file)
FIREBASE_CREDENTIALS_JSON={"type":"service_account", ...}
```

---

## API Reference

All endpoints are served by the Flask backend on port `5001`.

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/health` | GET | — | `{ status, cache_size }` |
| `/detect_face` | POST | `{ image: base64 }` | `{ success, face_count, error_type? }` |
| `/three-step-verify` | POST | `{ image, expected_numeric_id }` | `{ step1_face_recognition, step2_numeric_id_verification, overall_success }` |
| `/face-login` | POST | `{ image: base64 }` | `{ success, user: { id, name, accountType, … } }` |
| `/recognize` | POST | `{ image, expected_numeric_id }` | `{ success, recognized_name, verified_numeric_id }` |
| `/compare` | POST | `{ image1, image2 }` | `{ match, distance, threshold }` |
| `/generate-encoding` | POST | `{ images: [base64 × 3] }` | `{ success, encoding: base64, images_processed }` |
| `/add-employee` | POST | `{ name, numericId, image }` | `{ success, message }` |
| `/retrain` | POST | — | `{ success, message }` |
| `/clear-cache` | POST | — | `{ message }` |

### Three-Step Verify — Response Structure

```json
{
  "step1_face_recognition": {
    "success": true,
    "recognized_name": "Ahmed Ali",
    "message": "Recognized: Ahmed Ali (87%)"
  },
  "step2_numeric_id_verification": {
    "success": true,
    "firebase_numeric_id": "1042",
    "expected_numeric_id": "1042",
    "message": "IDs match"
  },
  "overall_success": true,
  "message": "Authentication successful for Ahmed Ali"
}
```

---

## Firebase Collections

| Collection | Key Fields |
|-----------|-----------|
| `users` | `id`, `numericId`, `name`, `username`, `password`, `accountType`, `department`, `status`, `faceEncoding` (128D base64), `image` (base64), `deviceFingerprint`, `sessionToken`, `salary`, `jobTitle` |
| `attendance` | `userId`, `date` (YYYY-MM-DD), `checkIn`, `checkOut`, `status` (Present / Late / Absent), `workedHours`, `overtimeHours` |
| `attendanceHistory` | mirrors `attendance` — historical archive |
| `leaveRequests` | `employeeId`, `leaveType`, `startDate`, `endDate`, `leaveDays`, `status` (Pending / Approved / Rejected), `supervisorId`, `routeToAdmin` |
| `leaveDays` | `employeeId`, `leaveRequestId`, `leaveDays`, `leaveType`, `approvedAt` |
| `absences` | `userId`, `date`, `reason`, `recorded` |
| `settings` | `departments[]`, `workingHours.startTime`, `workingHours.endTime`, `lateThreshold` |
| `notifications` | `userId`, `message`, `type`, `read`, `createdAt` |
| `accessDeniedLogs` | `attemptedBy{}`, `registeredTo{}`, `loginMethod`, `deviceFingerprint`, `timestamp` |
| `monitoring` | `userId`, `snapshot` (base64), `capturedAt` |
| `totalHours` | `userId`, `month`, `regularHours` |
| `overtimeRecords` | `userId`, `date`, `overtimeHours` |

---

## User Roles

| Role | Default Route | Permissions |
|------|--------------|-------------|
| `Employee` | `/camera` → `/userData` | Mark attendance, view own history, submit leave, manage profile |
| `Supervisor` | `/supervisor` | Approve team leave, view team attendance, edit team members |
| `Admin` | `/admin` | Full access — add/edit employees, system settings, analytics, device management |

> The first user with `numericId: 1` is treated as the system Admin.

---

## Deployment

### Backend — Railway (Docker)

```bash
# railway.json is already configured
# Set environment variables in Railway dashboard:
#   FIREBASE_CREDENTIALS_JSON  (full JSON string)
#   CORS_ORIGINS               (your Vercel/Netlify URL)
#   PORT                       (Railway sets this automatically)
```

The `Dockerfile` builds `python:3.11-slim` with full dlib compilation support. Build time is ~10–15 minutes on first deploy.

### Frontend — Vercel

```bash
cd frontend
npx vercel --prod

# Set these in Vercel dashboard → Environment Variables:
#   NEXT_PUBLIC_FACE_RECOGNITION_URL  (your Railway URL)
#   NEXT_PUBLIC_FIREBASE_*            (all Firebase config values)
#   EMAIL_USER / EMAIL_PASS
```

### Frontend — Netlify

```bash
# netlify.toml is already configured
cd frontend
npm run build
# Deploy the .next output via Netlify dashboard
```

---

## Diagrams

| File | Description |
|------|-------------|
| `FLOWCHART_DIAGRAM.html` | Interactive 7-tab flowchart — open in any browser |
| `DATA_FLOW_DIAGRAM.md` | DFD Level 0 / 1 / 2 for all main processes |
| `ERD_DATABASE.md` | Firebase collections entity relationship diagram |

---

## Face Recognition — How It Works

```
Employee photo (base64)
        │
        ▼
face_recognition.face_encodings(image, model='large')
        │
        ▼
128-dimensional float64 vector
        │
        ▼
face_distance(known_encodings, captured_encoding)
        │
        ▼
compare_faces(tolerance=0.45) → best match index
        │
        ▼
confidence = 1 − distance
        │
   confidence ≥ 0.55?
      Yes → return name
      No  → "Confidence too low"
```

Face encodings are stored as `base64` strings in Firestore and loaded into memory at server startup in a background thread. No local model files are needed.

---

## Face Encoding — Source Code

The encoding pipeline lives in three files:

| File | Responsibility |
|------|---------------|
| `backend/app/utils/image_utils.py` | Low-level helper — decodes base64, detects face locations, returns the 128D vector (with caching) |
| `ai/firebase_face_model.py` | Used during employee registration; also loads all stored encodings from Firestore at startup |
| `backend/app/routes/face_routes.py` | `/generate-encoding` endpoint — receives 3 photos from Admin UI, averages their encodings, returns base64 to store in Firestore |

---

### 1 · `get_face_encoding_from_base64` — `backend/app/utils/image_utils.py`

Core utility called by every endpoint that needs to encode an incoming frame.

```python
def get_face_encoding_from_base64(image_data, cache_key=None, encoding_cache=None):
    """Extract face encoding from base64 image with caching"""
    try:
        if cache_key and encoding_cache and cache_key in encoding_cache:
            return encoding_cache[cache_key]

        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)

        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Upscale small images (common on mobile) to improve face detection
        w, h = image.size
        if w < 640 or h < 480:
            scale = max(640 / w, 480 / h)
            image = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

        image_array = np.array(image)

        # Try with upscaling first, fallback to normal
        face_locations = face_recognition.face_locations(
            image_array, number_of_times_to_upsample=2, model='hog'
        )
        face_encodings = (
            face_recognition.face_encodings(
                image_array, known_face_locations=face_locations, model='large'
            )
            if face_locations else []
        )

        if len(face_encodings) == 0:
            face_encodings = face_recognition.face_encodings(image_array, model='large')

        if len(face_encodings) == 0:
            return None

        encoding = face_encodings[0]

        if cache_key and encoding_cache is not None:
            encoding_cache[cache_key] = encoding

        return encoding
    except Exception as e:
        print(f"Error in get_face_encoding_from_base64: {str(e)}")
        return None
```

---

### 2 · `generate_encoding_from_base64` — `ai/firebase_face_model.py`

Used during employee registration from the Admin panel. Adds contrast enhancement before encoding.

```python
def generate_encoding_from_base64(self, image_base64):
    """Generate face encoding from base64 image"""
    try:
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]

        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes))

        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Slight contrast boost to help dlib on low-quality webcam shots
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)

        image_array = np.array(image)
        encodings = face_recognition.face_encodings(image_array, model='large')

        if not encodings:
            return None, "No face detected"
        if len(encodings) > 1:
            return None, "Multiple faces detected"

        return encodings[0], "Success"
    except Exception as e:
        return None, f"Error: {str(e)}"
```

---

### 3 · `/generate-encoding` endpoint — `backend/app/routes/face_routes.py`

Called by the Admin UI when adding a new employee. Receives exactly 3 photos, generates an encoding for each, then stores the **average** as a single base64 string in Firestore.

```python
@app.route('/generate-encoding', methods=['POST'])
def generate_encoding():
    """Generate single face encoding from 3 images"""
    data = request.get_json()
    images = data.get('images', [])

    if len(images) != 3:
        return jsonify({'success': False, 'error': 'Exactly 3 images are required'}), 400

    encodings = []
    failed_images = []

    for idx, img_data in enumerate(images, 1):
        encoding = get_face_encoding_from_base64(img_data)
        if encoding is not None:
            encodings.append(encoding)
        else:
            failed_images.append(idx)

    if len(encodings) < 2:
        return jsonify({
            'success': False,
            'error': f'At least 2 valid faces required. Failed on image(s): {", ".join(map(str, failed_images))}'
        }), 400

    # Average the encodings → one robust 128D vector
    avg_encoding = np.mean(encodings, axis=0)

    # Serialise to base64 for Firestore storage
    encoding_b64 = base64.b64encode(avg_encoding.tobytes()).decode('utf-8')

    return jsonify({
        'success': True,
        'encoding': encoding_b64,
        'images_processed': len(encodings)
    })
```

> **Why average 3 encodings?**  
> Averaging reduces the effect of lighting variation and slight pose changes across the 3 captured frames, producing a more stable centroid in the 128D embedding space.

---

## License

This project was developed as a graduation project for academic purposes.  
© 2024 IntelliAttend Project. All rights reserved.

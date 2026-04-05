# Facial Recognition Login - Implementation Plan

## Problem

The "Use Facial Recognition" button on the login page currently just redirects to `/camera`, which is the **attendance page** — not a login flow. That page requires an existing session (`user` in sessionStorage), so it fails for unauthenticated users.

## Goal

Allow users to **log into the system** using only their face — no username or password needed.

---

## How It Works (High-Level Flow)

```
User clicks "Use Facial Recognition"
        ↓
Camera opens (inside login page)
        ↓
User's face is captured
        ↓
Image sent to backend → /face-login endpoint
        ↓
Backend compares face against ALL stored encodings in Firebase
        ↓
If match found → return user data (name, numericId, accountType)
        ↓
Frontend creates session (same as normal login)
        ↓
Redirect to correct dashboard (Admin / Supervisor / Employee)
```

---

## Files to Modify / Create

### Backend (1 change)

| File | Action | What |
|------|--------|------|
| `backend/app/routes/face_routes.py` | **ADD** new endpoint | `/face-login` — accepts image, returns matched user data |

**`/face-login` endpoint logic:**
1. Receive base64 image from frontend
2. Call `face_model.recognize_face()` to find matching employee
3. If match found → query Firebase for full user document by recognized name
4. Return complete user data (id, name, numericId, accountType, department, etc.)
5. If no match → return `{ success: false, message: "Face not recognized" }`

> **Key difference from `/recognize`**: No `expected_numeric_id` required. The face alone identifies the user.

---

### Frontend (5 files)

#### 1. New Hook: `frontend/src/app/login/hooks/useFaceLogin.ts`

**Purpose:** Manages the entire face login flow (camera, capture, API call, session creation, redirect).

**State it manages:**
- `cameraActive` — is camera streaming
- `detecting` — is face being processed
- `error` — error message to display
- `step` — current step (`idle` | `camera` | `processing` | `success` | `failed`)

**Functions it exposes:**
- `startCamera()` — request webcam access, start video stream
- `captureAndLogin()` — capture frame → send to `/face-login` → handle response
- `stopCamera()` — stop video stream and release webcam
- `cancel()` — go back to normal login form

**On successful recognition:**
1. Receive user data from backend
2. Fetch full user document from Firebase by `numericId` (to get document ID)
3. Store in `sessionStorage` (same format as normal login)
4. Call `updateUserSession(userId)`
5. Redirect based on `accountType`

---

#### 2. New Component: `frontend/src/app/login/facial-recognition/FaceLoginCamera.tsx`

**Purpose:** Camera preview + capture UI shown when user chooses face login.

**What it renders:**
- `<video>` element for live camera feed
- "Capture & Login" button
- "Cancel" button (returns to normal login)
- Status feedback (detecting spinner, success/error messages)
- Face oval overlay guide

---

#### 3. Modify: `frontend/src/app/login/hooks/useLogin.ts`

**Change:** Update `handleFacialRecognition` to toggle face login mode instead of redirecting to `/camera`.

```
// BEFORE
const handleFacialRecognition = () => {
    setFaceLoading(true);
    router.push("/camera");  // ← Wrong: goes to attendance page
};

// AFTER
const handleFacialRecognition = () => {
    setShowFaceLogin(true);  // ← Correct: shows camera in login page
};
```

**Add:** `showFaceLogin` state + `setShowFaceLogin` to returned values.

---

#### 4. Modify: `frontend/src/app/login/components/LoginContainer.tsx`

**Change:** Conditionally render either the login form OR the face login camera.

```
if showFaceLogin → render <FaceLoginCamera />
else → render <LoginForm /> + <FacialRecognitionButton />
```

---

#### 5. Modify: `frontend/src/app/login/types/index.ts`

**Add:** `FaceLoginResponse` type for the `/face-login` API response.

```typescript
interface FaceLoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    numericId: number;
    accountType: string;
    department: string;
    // ... rest of user fields
  };
  message: string;
}
```

**Update:** `LoginContainerProps` to include `showFaceLogin` and `onCancelFaceLogin`.

---

## Implementation Order

```
Step 1 → Backend: Add /face-login endpoint
Step 2 → Frontend types: Add FaceLoginResponse type, update LoginContainerProps
Step 3 → Frontend hook: Create useFaceLogin.ts
Step 4 → Frontend component: Create FaceLoginCamera.tsx
Step 5 → Frontend wiring: Update useLogin.ts + LoginContainer.tsx
Step 6 → Test the full flow
```

---

## Security Considerations

- **No password bypass risk**: Face login uses the same face encodings stored in Firebase that were generated during employee onboarding (admin adds employee with photo)
- **Same session format**: The session created is identical to normal login, so all existing role-based access control still works
- **Attempt limiting**: Add max 3 failed attempts before locking out (same as attendance camera)
- **Confidence threshold**: Use the existing 0.35 minimum confidence from `FirebaseFaceModel.recognize_face()`

---

## What This Does NOT Change

- ❌ Attendance marking flow (stays the same — camera page with three-step auth)
- ❌ Face model or encoding logic (reuses existing `FirebaseFaceModel`)
- ❌ Session management (same sessionStorage format)
- ❌ Role-based routing (same Admin/Supervisor/Employee logic)
- ❌ Any existing API endpoints (all kept as-is)

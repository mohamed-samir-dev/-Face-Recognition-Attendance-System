import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { updateUserSession, checkExistingSession, BlockedByUser } from "@/lib/services/auth/sessionService";
import { FaceLoginResponse } from "../types";

export type FaceLoginStep = "camera" | "processing" | "success" | "failed";

export interface RecognizedUserData {
  name: string;
  numericId: number;
  accountType: string;
  department: string;
  email: string;
  username: string;
  position: string;
  image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_FACE_RECOGNITION_URL || "http://localhost:5001";
const MAX_ATTEMPTS = 3;
const REDIRECT_DELAY = 3000;

export function useFaceLogin(onCancel: () => void) {
  const [step, setStep] = useState<FaceLoginStep>("camera");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [recognizedUser, setRecognizedUser] = useState<RecognizedUserData | null>(null);
  const [sessionBlocked, setSessionBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState<BlockedByUser | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError("");
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  const captureAndLogin = useCallback(async () => {
    if (attempts >= MAX_ATTEMPTS) {
      setError("Maximum attempts reached. Please try normal login.");
      setStep("failed");
      return;
    }

    const imageData = captureFrame();
    if (!imageData) {
      setError("Failed to capture image.");
      return;
    }

    setStep("processing");
    setError("");

    try {
      const res = await fetch(`${API_URL}/face-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data: FaceLoginResponse = await res.json();

      if (!data.success || !data.user) {
        setAttempts((prev) => prev + 1);
        setError(data.message || "Face not recognized. Try again.");
        setStep("camera");
        return;
      }

      // Fetch full user doc from Firebase
      const q = query(
        collection(db, "users"),
        where("numericId", "==", data.user.numericId)
      );
      const snapshot = await getDocs(q);

      let fullUserData = data.user;
      let userId = data.user.id;

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        userId = doc.id;
        fullUserData = { ...data.user, ...doc.data() } as typeof data.user;
      }

      // ── Single Session Check ──
      const sessionCheck = await checkExistingSession(userId);
      if (sessionCheck.blocked) {
        setBlockedBy(sessionCheck.blockedBy ?? null);
        setSessionBlocked(true);
        setStep("failed");
        stopCamera();
        return;
      }

      await updateUserSession(userId);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("attendanceUser", JSON.stringify(fullUserData));
        sessionStorage.setItem("sessionTime", new Date().getTime().toString());
      }

      // Store recognized user for success screen
      setRecognizedUser({
        name: fullUserData.name,
        numericId: fullUserData.numericId,
        accountType: fullUserData.accountType,
        department: fullUserData.department,
        email: fullUserData.email,
        username: fullUserData.username,
        position: fullUserData.position,
        image: (fullUserData as Record<string, unknown>).image as string | undefined,
      });

      setStep("success");
      stopCamera();

      // Delay redirect so user sees success screen
      setTimeout(() => {
        const accountType = fullUserData.accountType;
        let path = "/userData";
        if (fullUserData.numericId === 1 || accountType === "Admin") {
          path = "/admin";
        } else if (accountType === "Manager" || accountType === "Supervisor") {
          path = "/supervisor";
        }
        router.push(path);
      }, REDIRECT_DELAY);
    } catch {
      setAttempts((prev) => prev + 1);
      setError("Server error. Please try again.");
      setStep("camera");
    }
  }, [attempts, captureFrame, stopCamera, router]);

  const cancel = useCallback(() => {
    stopCamera();
    onCancel();
  }, [stopCamera, onCancel]);

  return {
    step,
    error,
    attempts,
    videoRef,
    recognizedUser,
    sessionBlocked,
    blockedBy,
    captureAndLogin,
    cancel,
    maxAttempts: MAX_ATTEMPTS,
  };
}

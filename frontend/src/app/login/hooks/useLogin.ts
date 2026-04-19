import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { LoginFormData } from "../types";
import { updateUserSession, checkExistingSession, BlockedByUser } from "@/lib/services/auth/sessionService";
import toast from "react-hot-toast";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60_000; // 1 minute

function getRedirectPath(userData: { numericId?: number; accountType?: string }) {
  if (userData.numericId === 1 || userData.accountType === "Admin") return "/admin";
  if (userData.accountType === "Manager" || userData.accountType === "Supervisor") return "/supervisor";
  return "/userData";
}

export function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);
  const [showFaceLogin, setShowFaceLogin] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [sessionBlocked, setSessionBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState<BlockedByUser | null>(null);
  const router = useRouter();

  // Auto-redirect if session exists
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = sessionStorage.getItem("attendanceUser");
    const sessionTime = sessionStorage.getItem("sessionTime");
    if (savedUser && sessionTime) {
      try {
        const userData = JSON.parse(savedUser);
        router.replace(getRedirectPath(userData));
      } catch {
        sessionStorage.clear();
      }
    }
  }, [router]);

  const handleLogin = async (formData: LoginFormData) => {
    // Check lockout
    const now = Date.now();
    if (lockoutUntil > now) {
      const secondsLeft = Math.ceil((lockoutUntil - now) / 1000);
      setError(`Too many attempts. Try again in ${secondsLeft}s.`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Try username first
      let q = query(
        collection(db, "users"),
        where("username", "==", formData.email),
        where("password", "==", formData.password)
      );
      let snapshot = await getDocs(q);

      // If no match with username, try email
      if (snapshot.empty) {
        q = query(
          collection(db, "users"),
          where("email", "==", formData.email),
          where("password", "==", formData.password)
        );
        snapshot = await getDocs(q);
      }

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;

        // ── Single Session Check ──
        const sessionCheck = await checkExistingSession(userId);
        if (sessionCheck.blocked) {
          setBlockedBy(sessionCheck.blockedBy ?? null);
          setSessionBlocked(true);
          setLoading(false);
          return;
        }

        await updateUserSession(userId);

        if (typeof window !== "undefined") {
          sessionStorage.setItem("attendanceUser", JSON.stringify(userData));
          sessionStorage.setItem("sessionTime", Date.now().toString());
        }

        setLoginAttempts(0);
        router.push(getRedirectPath(userData));
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_DURATION);
          setLoginAttempts(0);
          setError("Too many failed attempts. Account locked for 1 minute.");
        } else {
          setError(`Invalid username/email or password (${MAX_LOGIN_ATTEMPTS - newAttempts} attempts left)`);
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleFacialRecognition = () => {
    setFaceLoading(true);
    setShowFaceLogin(true);
    // Reset when face login view opens
    setTimeout(() => setFaceLoading(false), 500);
  };

  const handleClearSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
    }
    toast.success("Session cleared successfully");
  };

  return {
    error,
    loading,
    faceLoading,
    showFaceLogin,
    setShowFaceLogin,
    sessionBlocked,
    setSessionBlocked,
    blockedBy,
    handleLogin,
    handleFacialRecognition,
    handleClearSession,
  };
}

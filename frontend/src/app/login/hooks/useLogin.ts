import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { LoginFormData } from "../types";
import { updateUserSession } from "@/lib/services/auth/sessionService";

export function useLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [faceLoading, setFaceLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: LoginFormData) => {
    setError("");
    setLoading(true);

    try {
      // Try username first
      let q;
      try {
        q = query(
          collection(db, "users"),
          where("username", "==", formData.email),
          where("password", "==", formData.password)
        );
      } catch {
        throw new Error("Database configuration error");
      }

      let snapshot;
      try {
        snapshot = await getDocs(q);
      } catch {
        throw new Error("Database connection failed");
      }

      // If no match with username, try email
      if (snapshot.empty) {
        try {
          q = query(
            collection(db, "users"),
            where("email", "==", formData.email),
            where("password", "==", formData.password)
          );
        } catch  {
          throw new Error("Database configuration error");
        }
        try {
          snapshot = await getDocs(q);
        } catch  {
          throw new Error("Database connection failed");
        }
      }

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        const userId = snapshot.docs[0].id;
        const currentTime = new Date().getTime();

        // Update user session in Firebase
        await updateUserSession(userId);

        if (typeof window !== "undefined") {
          sessionStorage.setItem("attendanceUser", JSON.stringify(userData));
          sessionStorage.setItem("sessionTime", currentTime.toString());
        }

        // Route based on account type
        if (userData.numericId === 1 || userData.accountType === "Admin") {
          router.push("/admin");
        } else if (userData.accountType === "Manager" || userData.accountType === "Supervisor") {
          router.push("/supervisor");
        } else {
          router.push("/userData");
        }
      } else {
        setError("Invalid username/email or password");
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
    router.push("/camera");
  };

  const handleClearSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("attendanceUser");
      sessionStorage.removeItem("sessionTime");
      localStorage.removeItem("showUserData");
      localStorage.removeItem("totalHoursWorked");
    }
    router.push("/login");
  };

  return {
    error,
    loading,
    faceLoading,
    handleLogin,
    handleFacialRecognition,
    handleClearSession,
  };
}

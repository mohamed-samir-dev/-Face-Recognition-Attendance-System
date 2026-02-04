"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/services/user/userService";
import { User } from "@/lib/types";

// cspell:ignore Firestore
type FirestoreTimestamp = { toDate(): Date };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const savedUser = sessionStorage.getItem("attendanceUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  const refreshUserData = async () => {
    if (user) {
      try {
        const users = await getUsers();
        const updatedUser = users.find((u) => u.id === user.id);
        if (updatedUser) {
          // Convert Firestore timestamps to Date objects
          if (
            updatedUser.lastLogin &&
            typeof (updatedUser.lastLogin as unknown as FirestoreTimestamp)
              .toDate === "function"
          ) {
            updatedUser.lastLogin = (
              updatedUser.lastLogin as unknown as FirestoreTimestamp
            ).toDate();
          }
          if (
            updatedUser.sessionStartTime &&
            typeof (
              updatedUser.sessionStartTime as unknown as FirestoreTimestamp
            ).toDate === "function"
          ) {
            updatedUser.sessionStartTime = (
              updatedUser.sessionStartTime as unknown as FirestoreTimestamp
            ).toDate();
          }

          setUser(updatedUser);
          sessionStorage.setItem("attendanceUser", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  const clearSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("attendanceUser");
      sessionStorage.removeItem("sessionTime");
      localStorage.removeItem("showUserData");
      localStorage.removeItem("totalHoursWorked");
    }
  };

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return {
    user,
    mounted,
    logout,
    clearSession,
    refreshUserData,
  };
}

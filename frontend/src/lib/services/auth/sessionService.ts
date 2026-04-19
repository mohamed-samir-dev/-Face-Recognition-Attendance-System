import { doc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { UserSession } from "../../types/services";

// Generate a stable device fingerprint from browser properties
export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency,
  ].join("|");
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Generate a random session token
function generateSessionToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface BlockedByUser {
  name: string;
  image?: string;
  department?: string;
  position?: string;
}

// Check if this device is allowed to login
export const checkExistingSession = async (
  userId: string
): Promise<{ blocked: boolean; blockedBy?: BlockedByUser }> => {
  try {
    const currentFingerprint = getDeviceFingerprint();

    const q = query(
      collection(db, "users"),
      where("deviceFingerprint", "==", currentFingerprint)
    );
    const snapshot = await getDocs(q);

    const otherDoc = snapshot.docs.find((d) => d.id !== userId);
    if (!otherDoc) return { blocked: false };

    const d = otherDoc.data();
    return {
      blocked: true,
      blockedBy: {
        name: d.name || "Unknown",
        image: d.image || d.photoUrl || undefined,
        department: d.department || undefined,
        position: d.position || d.jobTitle || undefined,
      },
    };
  } catch {
    return { blocked: false };
  }
};

export const updateUserSession = async (userId: string): Promise<void> => {
  if (!db) {
    console.error("Firebase db is not initialized");
    return;
  }

  const userRef = doc(db, "users", userId);
  const now = new Date();

  await updateDoc(userRef, {
    lastLogin: now,
    isActive: true,
    sessionStartTime: now,
    sessionToken: generateSessionToken(),
    deviceFingerprint: getDeviceFingerprint(),
  });
};

export const clearUserSession = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    // Only clear session — keep deviceFingerprint so device binding stays active
    await updateDoc(userRef, {
      isActive: false,
      sessionToken: null,
    });
  } catch (e) {
    console.error("Error clearing session:", e);
  }
};

// Called by Supervisor (for employees) or Admin (for supervisors) to unlock a device
export const resetDeviceBinding = async (userId: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    deviceFingerprint: null,
    isActive: false,
    sessionToken: null,
  });
};

export const getUserSession = async (userId: string): Promise<UserSession | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        lastLogin: data.lastLogin?.toDate() || new Date(),
        isActive: data.isActive || false,
        sessionStartTime: data.sessionStartTime?.toDate() || new Date()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

export const formatLastLogin = (lastLogin: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return lastLogin.toLocaleDateString();
    }
  }
};
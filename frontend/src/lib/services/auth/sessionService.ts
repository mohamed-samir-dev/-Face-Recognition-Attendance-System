import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {UserSession}from "../../types/services"


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
    sessionStartTime: now
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
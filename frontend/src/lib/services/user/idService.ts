import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const ID_COUNTER_DOC = "userIdCounter";
const COUNTERS_COLLECTION = "counters";

export const getNextUserId = async (): Promise<number> => {
  try {
    // Get all users to find the highest existing ID
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    
    let highestId = 0;
    snapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.numericId && userData.numericId > highestId) {
        highestId = userData.numericId;
      }
    });
    
    const nextId = highestId + 1;
    
    // Update counter for consistency
    const counterRef = doc(db, COUNTERS_COLLECTION, ID_COUNTER_DOC);
    await setDoc(counterRef, { currentId: nextId });
    
    return nextId;
  } catch (error) {
    console.error("Error getting next user ID:", error);
    return Date.now(); // Fallback to timestamp
  }
};

export const initializeUserIds = async (): Promise<void> => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    
    let currentId = 1;
    const batch: Promise<void>[] = [];
    
    snapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data();
      if (!userData.numericId) {
        const userRef = doc(db, "users", userDoc.id);
        batch.push(setDoc(userRef, { ...userData, numericId: currentId }, { merge: true }));
        currentId++;
      }
    });
    
    await Promise.all(batch);
    
    // Update counter
    const counterRef = doc(db, COUNTERS_COLLECTION, ID_COUNTER_DOC);
    await setDoc(counterRef, { currentId: currentId - 1 });
    
  } catch (error) {
    console.error("Error initializing user IDs:", error);
  }
};
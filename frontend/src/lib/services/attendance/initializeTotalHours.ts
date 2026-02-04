import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const initializeTotalHoursForAllUsers = async (): Promise<void> => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const totalHoursDoc = await getDoc(doc(db, "totalHours", userId));
      
      if (!totalHoursDoc.exists()) {
        await setDoc(doc(db, "totalHours", userId), {
          userId,
          totalHours: 0,
          lastUpdated: new Date().toISOString()
        });
        console.log(`Initialized totalHours for user: ${userId}`);
      }
    }
    
    console.log("✅ Total hours collection checked");
  } catch (error) {
    console.error("Error initializing total hours:", error);
  }
};
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const addRandomSalariesToUsers = async (): Promise<void> => {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    
    const updates = snapshot.docs.map(async (userDoc) => {
      const userData = userDoc.data();
      
      // Skip admin user and users who already have salary
      if (userData.numericId === 1 || userData.salary) return;
      
      // Generate random salary between 30,000 and 120,000
      const randomSalary = Math.floor(Math.random() * (120000 - 30000 + 1)) + 30000;
      
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, { salary: randomSalary });
    });
    
    await Promise.all(updates);
    console.log("Random salaries added to all users");
  } catch (error) {
    console.error("Error adding salaries:", error);
  }
};
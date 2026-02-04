import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getTeamMembers(supervisorId: string): Promise<any[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("accountType", "==", "Employee"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

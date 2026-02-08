import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export async function getTeamMembers(supervisorId: string): Promise<any[]> {
  try {
    const supervisorDoc = await getDoc(doc(db, "users", supervisorId));
    if (!supervisorDoc.exists()) return [];
    
    const supervisorData = supervisorDoc.data();
    const supervisorDepartment = supervisorData?.department || supervisorData?.Department;
    
    if (!supervisorDepartment) return [];
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("accountType", "==", "Employee"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(user => 
        (user.department === supervisorDepartment || user.Department === supervisorDepartment)
      );
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

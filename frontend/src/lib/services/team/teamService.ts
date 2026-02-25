import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export async function getTeamMembers(supervisorId: string): Promise<TeamMember[]> {
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
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string,
          numericId: data.numericId as string | number,
          jobTitle: data.jobTitle as string | undefined
        };
      })
      .filter((user) => 
        (user.name && (user.numericId !== undefined))
      )
      .filter((user) => {
        const userData = snapshot.docs.find(d => d.id === user.id)?.data();
        return userData && (userData.department === supervisorDepartment || userData.Department === supervisorDepartment);
      });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

interface TeamMember {
  id: string;
  name: string;
  numericId: string | number;
  jobTitle?: string;
}

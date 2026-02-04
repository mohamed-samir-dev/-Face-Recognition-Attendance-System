import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { UnexcusedAbsence } from "../../types/unexcusedAbsence";

export const getUnexcusedAbsences = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  try {
    const absencesCollection = collection(db, "unexcusedAbsences");
    const q = query(
      absencesCollection,
      where("userId", "==", userId),
      where("status", "==", "Active")
    );
    
    const snapshot = await getDocs(q);
    const totalPenaltyDays = snapshot.docs.reduce((total, doc) => {
      const data = doc.data() as UnexcusedAbsence;
      return total + (data.penaltyDays || 0);
    }, 0);
    
    return totalPenaltyDays;
  } catch (error) {
    console.error('Error fetching unexcused absences:', error);
    return 0;
  }
};



export const getAllUnexcusedAbsences = async (): Promise<UnexcusedAbsence[]> => {
  try {
    const absencesCollection = collection(db, "unexcusedAbsences");
    const snapshot = await getDocs(absencesCollection);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UnexcusedAbsence));
  } catch (error) {
    console.error('Error fetching all unexcused absences:', error);
    return [];
  }
};



import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/lib/types";

export interface EmailValidationResult {
  isUnique: boolean;
  existingUser?: {
    id: string;
    name: string;
    department: string;
    jobTitle: string;
    numericId: number;
    accountType: string;
    supervisor?: string;
  };
}

export const validateEmailUniqueness = async (email: string): Promise<EmailValidationResult> => {
  const usersCollection = collection(db, "users");
  const emailQuery = query(usersCollection, where("email", "==", email));
  const snapshot = await getDocs(emailQuery);
  
  if (snapshot.empty) {
    return { isUnique: true };
  }
  
  const existingUserDoc = snapshot.docs[0];
  const existingUser = existingUserDoc.data() as User;
  
  return {
    isUnique: false,
    existingUser: {
      id: existingUser.id,
      name: existingUser.name,
      department: existingUser.department || 'Not assigned',
      jobTitle: existingUser.jobTitle || 'Not specified',
      numericId: existingUser.numericId || 0,
      accountType: existingUser.accountType || 'Employee',
      supervisor: existingUser.supervisor
    }
  };
};
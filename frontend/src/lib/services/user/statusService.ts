import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function updateUserStatus(userId: string, status: 'Active' | 'OnLeave' | 'Inactive'): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { status });
}

export async function setAllEmployeesInactive(): Promise<void> {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const updates = usersSnapshot.docs
    .filter(doc => doc.data().status !== 'OnLeave')
    .map(doc => updateDoc(doc.ref, { status: 'Inactive' }));
  await Promise.all(updates);
}

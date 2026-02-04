import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "@/lib/types";
import { getNextUserId } from "./idService";

export const getUsers = async (): Promise<User[]> => {
  const usersCollection = collection(db, "users");
  const snapshot = await getDocs(usersCollection);
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return users;
};

export const createUserWithId = async (userData: Omit<User, 'id' | 'numericId'>): Promise<User> => {
  const numericId = await getNextUserId();
  const documentId = `user_${numericId.toString().padStart(4, '0')}_${userData.username}`;
  const userRef = doc(db, "users", documentId);
  
  const newUser: User = {
    id: documentId,
    numericId,
    ...userData,
    // Set default notification preferences
    systemAnnouncements: true,
    leaveStatusUpdates: true,
    attendanceReminders: true
  };
  
  // Save user first
  await setDoc(userRef, newUser);
  
  // Then generate face encoding
  if (userData.image) {
    try {
      console.log('Calling /add-employee API...');
      const response = await fetch('http://localhost:5001/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          numericId: numericId,
          image: userData.image
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.error || 'Failed to generate face encoding');
      }
      
      const result = await response.json();
      console.log('API Success:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate face encoding');
      }
    } catch (error) {
      console.error('Face encoding generation failed:', error);
      // Don't throw - user is already created
      alert('Warning: Face encoding failed. Employee added but face recognition may not work. Please edit employee and re-upload photo.');
    }
  }
  
  return newUser;
};

export const getUserDisplayId = (user: User): string => {
  return user?.numericId?.toString() || "1";
};

export const updateUserDepartment = async (userId: string, department: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { department, Department: department });
  
  // Update department employee count
  try {
    const { updateDepartmentEmployeeCount, getCompanySettings } = await import('../system/settingsService');
    const settings = await getCompanySettings();
    const dept = settings.departments.find(d => d.name === department);
    if (dept) {
      await updateDepartmentEmployeeCount(dept.id);
    }
  } catch (error) {
    console.error('Error updating department employee count:', error);
  }
};

export const getUsersByDepartment = async (departmentName: string): Promise<User[]> => {
  const users = await getUsers();
  return users.filter(user => 
    user.department === departmentName || user.Department === departmentName
  );
};

export const assignUserToDepartment = async (userId: string, departmentName: string): Promise<void> => {
  await updateUserDepartment(userId, departmentName);
};

export const removeUserFromDepartment = async (userId: string): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { department: '', Department: '' });
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  // If image is being updated, regenerate face encoding
  if (userData.image) {
    const users = await getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      try {
        const response = await fetch('http://localhost:5001/add-employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            numericId: user.numericId,
            image: userData.image
          })
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to update face encoding');
        }
      } catch (error) {
        console.error('Face encoding update failed:', error);
        throw new Error('Failed to update face. Please ensure photo shows face clearly.');
      }
    }
  }
  
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, userData);
};

export const getUserByName = async (name: string): Promise<User | null> => {
  const users = await getUsers();
  return users.find(user => user.name.toLowerCase() === name.toLowerCase()) || null;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // Delete the user
  await deleteDoc(doc(db, "users", userId));
  
  // Reorganize IDs
  const users = await getUsers();
  const sortedUsers = users.filter(u => u.numericId !== 1).sort((a, b) => (a.numericId || 0) - (b.numericId || 0));
  
  // Reassign sequential IDs starting from 1 (skip admin)
  for (let i = 0; i < sortedUsers.length; i++) {
    const newId = i + 2; // Start from 2 (admin is 1)
    if (sortedUsers[i].numericId !== newId) {
      const userRef = doc(db, "users", sortedUsers[i].id);
      await updateDoc(userRef, { numericId: newId });
    }
  }
};
import { getUsers, updateUser } from "../user/userService";

export const initializeUserAccountTypes = async (): Promise<void> => {
  try {
    const users = await getUsers();
    
    for (const user of users) {
      if (!user.accountType) {
        const accountType = user.numericId === 1 ? 'Admin' : 'Employee';
        await updateUser(user.id, { 
          accountType,
          status: user.status || 'Active',
          isActive: true
        });
      }
    }
    
    console.log('User account types initialized successfully');
  } catch (error) {
    console.error('Error initializing user account types:', error);
  }
};
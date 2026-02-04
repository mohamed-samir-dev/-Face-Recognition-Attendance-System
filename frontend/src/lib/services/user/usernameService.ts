import { getUsers } from './userService';

export const generateProfessionalUsername = async (name: string): Promise<string> => {
  const users = await getUsers();
  const existingUsernames = users.map(user => user.username?.toLowerCase()).filter(Boolean);
  
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const nameParts = cleanName.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    throw new Error('Invalid name provided');
  }
  
  const patterns = [
    nameParts.length > 1 ? `${nameParts[0]}.${nameParts[nameParts.length - 1]}` : null,
    nameParts.length > 1 ? `${nameParts[0]}${nameParts[nameParts.length - 1]}` : null,
    nameParts[0],
    nameParts.length > 1 ? `${nameParts[0][0]}.${nameParts[nameParts.length - 1]}` : null,
    nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1]}` : null,
  ].filter(Boolean) as string[];
  
  // Check each pattern with numbers from the start
  for (const pattern of patterns) {
    // Try pattern without number first
    if (!existingUsernames.includes(pattern)) {
      return pattern;
    }
    
    // Try with numbers 1-999
    for (let i = 1; i <= 999; i++) {
      const numberedUsername = `${pattern}${i}`;
      if (!existingUsernames.includes(numberedUsername)) {
        return numberedUsername;
      }
    }
  }
  
  // Final fallback with timestamp
  return `user${Date.now().toString().slice(-6)}`;
};

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const users = await getUsers();
  return !users.some(user => user.username?.toLowerCase() === username.toLowerCase());
};
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/lib/types';

export const generateStrongPassword = (): string => {
  const length = 12;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { password: newPassword });
};

export const sendPasswordChangeEmail = async (user: User, newPassword: string): Promise<void> => {
  console.log(`Email sent to ${user.email}:`);
  console.log(`Subject: Password Changed - Face Recognition Attendance System`);
  console.log(`Dear ${user.name},`);
  console.log(`Your password has been changed by an administrator.`);
  console.log(`New Password: ${newPassword}`);
  console.log(`Please log in with your new password and consider changing it for security.`);
  console.log(`Best regards,`);
  console.log(`Face Recognition Attendance System`);
  
  return Promise.resolve();
};
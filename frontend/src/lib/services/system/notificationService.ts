import { collection, query, where, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {Notification}from "../../types/services"

const checkUserNotificationPreference = async (): Promise<boolean> => {
  // Always return true for system announcements to ensure all employees get notifications
  return true;
};

export const createNotification = async (employeeId: string, message: string, type: 'leave_approved' | 'leave_rejected' | 'leave_canceled' | 'vacation_announcement' | 'holiday_updated' | 'holiday_deleted' | 'holiday_expired' | 'working_hours_changed' | 'attendance_rules_changed' | 'attendance_reminder'): Promise<void> => {
  try {
    const shouldNotify = await checkUserNotificationPreference();
    if (!shouldNotify) return;
    
    const timestamp = new Date().getTime();
    const documentId = `notification_${type}_${employeeId}_${timestamp}`;
    const notificationRef = doc(db, "notifications", documentId);
    
    await setDoc(notificationRef, {
      id: documentId,
      employeeId,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
};

export const getNotifications = async (employeeId: string): Promise<Notification[]> => {
  try {
    const notificationsCollection = collection(db, "notifications");
    const q = query(notificationsCollection, where("employeeId", "==", employeeId));
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { isRead: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const createVacationNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'vacation_announcement')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating vacation notifications:", error);
    throw new Error("Failed to create vacation notifications");
  }
};

export const createHolidayUpdateNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'holiday_updated')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating holiday update notifications:", error);
    throw new Error("Failed to create holiday update notifications");
  }
};

export const createHolidayDeleteNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'holiday_deleted')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating holiday delete notifications:", error);
    throw new Error("Failed to create holiday delete notifications");
  }
};

export const createHolidayExpiredNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'holiday_expired')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating holiday expired notifications:", error);
    throw new Error("Failed to create holiday expired notifications");
  }
};

export const createWorkingHoursChangeNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'working_hours_changed')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating working hours change notifications:", error);
    throw new Error("Failed to create working hours change notifications");
  }
};

export const createAttendanceRulesChangeNotificationForAllEmployees = async (message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const employees = users.filter(user => user.numericId !== 1 && user.numericId);
    
    const notificationPromises = employees.map(user => 
      createNotification(user.numericId!.toString(), message, 'attendance_rules_changed')
    );
    
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating attendance rules change notifications:", error);
    throw new Error("Failed to create attendance rules change notifications");
  }
};

export const createAttendanceReminder = async (employeeId: string, message: string): Promise<void> => {
  try {
    const { getUsers } = await import('../user/userService');
    const users = await getUsers();
    const user = users.find(u => u.numericId?.toString() === employeeId);
    
    if (!user || !(user.attendanceReminders ?? true)) return;
    
    const timestamp = new Date().getTime();
    const documentId = `notification_attendance_reminder_${employeeId}_${timestamp}`;
    const notificationRef = doc(db, "notifications", documentId);
    
    await setDoc(notificationRef, {
      id: documentId,
      employeeId,
      message,
      type: 'attendance_reminder',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating attendance reminder:", error);
  }
};
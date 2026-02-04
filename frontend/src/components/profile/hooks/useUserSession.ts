import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { getUserSession, formatLastLogin } from "@/lib/services/auth/sessionService";
import { UserSession } from "@/lib/types/services";
import { isEmployeeOnLeave } from "@/lib/services/leave/leaveStatusService";
import { getUsers } from "@/lib/services/user/userService";

export function useUserSession(user: User | null) {
  const [sessionData, setSessionData] = useState<UserSession | null>(null);
  const [lastLoginText, setLastLoginText] = useState<string>("Loading...");
  const [currentStatus, setCurrentStatus] = useState<string>("Active");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const session = await getUserSession(user.id);
      if (session) {
        setSessionData(session);
        setLastLoginText(formatLastLogin(session.lastLogin));
      }
      
      // Get current status from database
      if (user.numericId && user.numericId !== 1) {
        const leaveStatus = await isEmployeeOnLeave(user.numericId.toString());
        setCurrentStatus(leaveStatus ? "On Leave" : (user.status || "Active"));
      } else {
        setCurrentStatus(user.status || "Active");
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      if (sessionData) {
        setLastLoginText(formatLastLogin(sessionData.lastLogin));
      }
      
      // Re-check status from database
      const users = await getUsers();
      const currentUser = users.find(u => u.id === user.id);
      
      if (user.numericId && user.numericId !== 1) {
        const leaveStatus = await isEmployeeOnLeave(user.numericId.toString());
        setCurrentStatus(leaveStatus ? "On Leave" : (currentUser?.status || "Active"));
      } else {
        setCurrentStatus(currentUser?.status || "Active");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, sessionData]);

  const getAccountType = (): string => {
    if (!user) return "Employee";
    if (user.numericId === 1) return "Admin";
    return user.accountType || "Employee";
  };

  const getAccountStatus = (): string => {
    return currentStatus;
  };

  return {
    lastLoginText,
    accountType: getAccountType(),
    accountStatus: getAccountStatus(),
    isActive: sessionData?.isActive || false
  };
}
"use client";

import { useState, useEffect } from "react";
import { getUsers, updateUserDepartment } from "@/lib/services/user/userService";
import { useLeaveDays } from "../hooks/useLeaveDays";
import { ProfileSectionProps } from "../types";
import { ProfileImage, ProfileInfo, ProfileActions } from "./components";

export default function ProfileSection({
  user,
  onRequestLeave,
  onTakePhoto,
  onCheckOut,
}: ProfileSectionProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const { leaveDays, vacationDays } = useLeaveDays(user?.numericId?.toString());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getUsers();
        const updatedUser = users.find((u) => u.id === user.id);
        if (updatedUser) {
          if (!updatedUser.department && !updatedUser.Department) {
            await updateUserDepartment(updatedUser.id, "General");
            updatedUser.department = "General";
          }
          setCurrentUser(updatedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    
    const handleStatusUpdate = () => {
      fetchUserData();
    };
    
    window.addEventListener('leaveRequestUpdated', handleStatusUpdate);
    window.addEventListener('timerStarted', handleStatusUpdate);
    window.addEventListener('timerCompleted', handleStatusUpdate);
    const interval = setInterval(fetchUserData, 30000);
    
    return () => {
      window.removeEventListener('leaveRequestUpdated', handleStatusUpdate);
      window.removeEventListener('timerStarted', handleStatusUpdate);
      window.removeEventListener('timerCompleted', handleStatusUpdate);
      clearInterval(interval);
    };
  }, [user.id]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <ProfileImage image={currentUser.image} name={currentUser.name} />
          <ProfileInfo 
            name={currentUser.name}
            numericId={currentUser.numericId}
            department={currentUser?.Department || currentUser?.department}
            status={currentUser.status}
          />
        </div>
        <ProfileActions 
          onRequestLeave={onRequestLeave} 
          onTakePhoto={onTakePhoto} 
          onCheckOut={onCheckOut} 
          userStatus={currentUser.status}
          leaveDaysTaken={leaveDays}
          totalLeaveDays={vacationDays}
        />
      </div>
    </div>
  );
}

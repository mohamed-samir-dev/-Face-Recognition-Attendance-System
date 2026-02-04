import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../components/employee/ToastNotification";
import { Employee } from "../types";

export function useEmployeeNotification(employee: Employee) {
  const hasShownToast = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasShownToast.current) return;
    hasShownToast.current = true;

    const savedUser = typeof window !== "undefined" ? sessionStorage.getItem("attendanceUser") : null;
    const userData = savedUser ? JSON.parse(savedUser) : null;
    const isSupervisor = userData?.accountType === "Manager" || userData?.accountType === "Supervisor";
    const redirectPath = isSupervisor ? "/supervisor" : "/userData";

    if (employee.id === "attendance_taken") {
      showToast({
        type: "error",
        title: "Attendance Already Taken",
        message: "You can only take attendance once per day",
        duration: 4000,
      });
      setTimeout(() => router.push(redirectPath), 4500);
      return;
    }

    showToast({
      type: "success",
      title: `Welcome, ${employee.name}!`,
      message: "Attendance marked successfully",
      duration: 3000,
    });

    setTimeout(() => router.push(redirectPath), 3000);
  }, [employee, router]);
}

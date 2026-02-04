import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitLeaveRequest } from "@/lib/services/leave/leaveService";
import { getUserLeaveDays } from "@/lib/services/leave/leaveDaysService";
import { getCompanySettings } from "@/lib/services/system/settingsService";

type LeaveType =
  | "Sick Leave"
  | "Vacation"
  | "Personal Leave"
  | "Maternity Leave"
  | "Paternity Leave";

interface LeaveFormData {
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  contactName: string;
  phoneNumber: string;
}

export function useLeaveRequest() {
  const router = useRouter();
  const [formData, setFormData] = useState<LeaveFormData>({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
    contactName: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [dateError, setDateError] = useState<string>("");
  const [leaveDaysTaken, setLeaveDaysTaken] = useState(0);
  const [allowedLeaveDays, setAllowedLeaveDays] = useState<number | null>(null);
  const [leaveWarning, setLeaveWarning] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validate dates when either start or end date changes
    if (name === "startDate" || name === "endDate") {
      validateDates(newFormData.startDate, newFormData.endDate);
      validateLeaveDays(newFormData.startDate, newFormData.endDate);
    }
  };

  const validateDates = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setDateError("End date cannot be before start date");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  const calculateLeaveDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  };

  const validateLeaveDays = (startDate: string, endDate: string) => {
    if (startDate && endDate && allowedLeaveDays !== null) {
      const requestedDays = calculateLeaveDays(startDate, endDate);
      const remainingDays = allowedLeaveDays - leaveDaysTaken;
      
      if (requestedDays > 5) {
        setLeaveWarning(
          `You cannot request more than 5 days of leave at a time. You are requesting ${requestedDays} days. Please adjust your request to 5 days or fewer.`
        );
      } else if (requestedDays > remainingDays) {
        setLeaveWarning(
          `You are requesting ${requestedDays} days, but you only have ${remainingDays} days remaining out of your ${allowedLeaveDays} annual leave allowance. Please adjust your request accordingly.`
        );
      } else {
        setLeaveWarning("");
      }
    } else {
      setLeaveWarning("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    userId: string,
    userName: string,
    numericId?: number,
    redirectPath: string = "/userData"
  ) => {
    e.preventDefault();

    // Check for date validation error
    if (dateError) {
      setToast({ message: dateError, type: "error", isVisible: true });
      return;
    }

    // Ensure allowedLeaveDays is loaded before proceeding
    if (allowedLeaveDays === null) {
      setToast({ 
        message: "Loading leave settings. Please wait...", 
        type: "error", 
        isVisible: true 
      });
      return;
    }

    const leaveDays = calculateLeaveDays(
      formData.startDate,
      formData.endDate
    );
    const remainingDays = allowedLeaveDays - leaveDaysTaken;

    // Check if requested days exceed 5-day limit
    if (leaveDays > 5) {
      setToast({ 
        message: `Cannot submit request. Maximum 5 days allowed per request. You requested ${leaveDays} days.`, 
        type: "error", 
        isVisible: true 
      });
      return;
    }

    // Check if requested days exceed remaining days
    if (leaveDays > remainingDays) {
      setToast({ 
        message: `Cannot submit request. You have ${remainingDays} days remaining, but requested ${leaveDays} days.`, 
        type: "error", 
        isVisible: true 
      });
      return;
    }

    setIsSubmitting(true);
    try {

      await submitLeaveRequest({
        employeeId: numericId?.toString() || userId,
        employeeName: userName,
        leaveType: formData.leaveType as LeaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveDays,
        reason: formData.reason,
        status: "Pending",
      });

      setToast({
        message: "Leave request submitted successfully!",
        type: "success",
        isVisible: true,
      });
      setTimeout(() => router.push(redirectPath), 2000);
    } catch {
      setToast({
        message: "Failed to submit leave request. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user.numericId) {
          const [taken, settings] = await Promise.all([
            getUserLeaveDays(user.numericId.toString()),
            getCompanySettings()
          ]);
          setLeaveDaysTaken(taken);
          setAllowedLeaveDays(settings.attendanceRules?.vacationDays ?? 30);
        } else {
          setAllowedLeaveDays(30);
        }
      } catch (error) {
        console.error('Error fetching leave data:', error);
        setAllowedLeaveDays(30);
      }
    };
    fetchLeaveData();
  }, []);

  // Re-validate when allowedLeaveDays changes
  useEffect(() => {
    if (formData.startDate && formData.endDate && allowedLeaveDays !== null) {
      validateLeaveDays(formData.startDate, formData.endDate);
    }
  }, [allowedLeaveDays]);

  const isDisabled = () => {
    if (formData.startDate && formData.endDate) {
      const requestedDays = calculateLeaveDays(formData.startDate, formData.endDate);
      return requestedDays > 5 || !!dateError;
    }
    return !!dateError;
  };

  return {
    formData,
    isSubmitting,
    disabled: isDisabled(),
    toast,
    dateError,
    leaveWarning,
    leaveDaysTaken,
    allowedLeaveDays,
    handleChange,
    handleSubmit,
    closeToast,
  };
}

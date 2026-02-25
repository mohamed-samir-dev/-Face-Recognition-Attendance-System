import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  performThreeStepAuthentication,
  getDetailedErrorMessage,
} from "@/lib/services/auth/threeStepAuthService";
import { updateUserSession } from "@/lib/services/auth/sessionService";
import { recordDailyAttendance } from "@/lib/services/attendance/dailyAttendanceService";
import { recordCheckOut } from "@/lib/services/attendance/checkoutService";
import { User } from "@/lib/types";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { useWorkTimer } from "@/components/dashboard/hooks/useWorkTimer";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  username?: string;
  numericId?: number;
  password?: string;
  photoUrl?: string;
  phone?: string;
  address?: string;
  salary?: number;
  hireDate?: string;
}

export function useAttendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
  const [recognizedEmployee, setRecognizedEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(3);
  const [exhaustedAttempts, setExhaustedAttempts] = useState<boolean>(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [showAlreadyTakenModal, setShowAlreadyTakenModal] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkOutData, setCheckOutData] = useState<Record<string, unknown> | null>(null);
  const [verificationStep, setVerificationStep] = useState<'face' | 'id' | 'complete' | ''>("");
  const [faceStatus, setFaceStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [idStatus, setIdStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [recognizedName, setRecognizedName] = useState<string>("");
  const [verifiedId, setVerifiedId] = useState<string>("");
  const [showUnauthorizedWarning, setShowUnauthorizedWarning] = useState(false);
  const [recognizedImage, setRecognizedImage] = useState<string>("");
  const [detectedUser, setDetectedUser] = useState<Record<string, unknown> | null>(null);
  const [expectedUser, setExpectedUser] = useState<User | null>(null);

  const { user } = useAuth();
  useWorkTimer(user?.id);
  const router = useRouter();

  const processAttendance = async (
    imageData: string,
    stopCamera: () => void
  ) => {
    try {
      setDetecting(true);
      setError("");
      setMultipleFaces(false);

      const currentUser = user;
      if (!currentUser?.numericId || !currentUser?.name) {
        setError("User session not found. Please login again.");
        setDetecting(false);
        return;
      }

      setVerificationStep('face');
      setFaceStatus('pending');
      console.log(`Starting three-step authentication for: ${currentUser.name} (ID: ${currentUser.numericId})`);

      const authResult = await performThreeStepAuthentication(imageData, currentUser);

      if (authResult.overall_success) {
        setFaceStatus('success');
        setRecognizedName(currentUser.name);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setVerificationStep('id');
        setIdStatus('pending');
        await new Promise(resolve => setTimeout(resolve, 600));
        setIdStatus('success');
        setVerifiedId(currentUser.numericId?.toString() || '');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setVerificationStep('complete');
        await new Promise(resolve => setTimeout(resolve, 1200));
        setVerificationStep("");

        setRecognizedEmployee({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email || "",
          department: currentUser.department || currentUser.Department || "",
          position: currentUser.jobTitle || "",
          username: currentUser.username,
          numericId: currentUser.numericId,
          password: currentUser.password,
        });

        setRecognizedUser(currentUser);
        setAttendanceMarked(true);
        stopCamera();

        const attendanceResult = await recordDailyAttendance(currentUser.id, currentUser.name);

        if (attendanceResult.isLate) {
          localStorage.setItem("showLateToast", "true");
        }

        if (!attendanceResult.success && attendanceResult.message.includes('leave')) {
          setError(attendanceResult.message);
          stopCamera();
          return;
        }

        await updateUserSession(currentUser.id);
        
        try {
          const { startWorkTimer } = await import('@/lib/services/attendance/timerService');
          await startWorkTimer(currentUser.id);
          console.log('✓ Work timer started successfully');
          window.dispatchEvent(new CustomEvent('timerStarted'));
        } catch (timerError) {
          console.error('Error starting timer:', timerError);
        }

        if (typeof window !== "undefined") {
          const currentHours = parseInt(localStorage.getItem("totalHoursWorked") || "0");
          localStorage.setItem("totalHoursWorked", (currentHours + 1).toString());
          const attendanceTime = new Date().toISOString();
          localStorage.setItem("lastAttendance", attendanceTime);
          localStorage.setItem("recognizedEmployee", JSON.stringify(currentUser));
        }

        console.log("✓ Three-step authentication successful - attendance marked");
      } else {
        if (!authResult.step1_face_recognition.success) {
          setFaceStatus('failed');
        } else {
          setFaceStatus('success');
          setRecognizedName(authResult.step1_face_recognition.recognized_name || '');
          
          // Fetch the recognized user's image from Firebase
          try {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase/config');
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", authResult.step1_face_recognition.recognized_name));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              setRecognizedImage(userData.image || "");
              setDetectedUser(userData);
            }
          } catch (err) {
            console.error('Error fetching recognized user image:', err);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setVerificationStep('id');
          setIdStatus('failed');
          setShowUnauthorizedWarning(true);
          setExpectedUser(currentUser);
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        setVerificationStep("");

        const errorMessage = getDetailedErrorMessage(authResult);

        setRecognizedEmployee({
          id: "unauthorized",
          name: "Authentication Failed",
          email: "",
          department: "",
          position: "",
        });

        const newAttempts = attemptsRemaining - 1;
        setAttemptsRemaining(newAttempts);

        console.log(`Three-step authentication failed:`, authResult);

        if (newAttempts === 0) {
          setExhaustedAttempts(true);
          stopCamera();
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setError(errorMessage);
        }
      }
    } catch (error) {
      console.error("Three-step authentication error:", error);

      const newAttempts = attemptsRemaining - 1;
      setAttemptsRemaining(newAttempts);

      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        setError("Connection error. Please ensure the face recognition server is running on localhost:5001");
      } else {
        setError("Authentication failed. Please try again.");
      }

      if (newAttempts === 0) {
        setExhaustedAttempts(true);
        stopCamera();
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } finally {
      setDetecting(false);
    }
  };

  const processCheckOut = async (
    imageData: string,
    stopCamera: () => void
  ) => {
    try {
      setDetecting(true);
      setError("");
      setMultipleFaces(false);

      const currentUser = user;
      if (!currentUser?.numericId || !currentUser?.name) {
        setError("User session not found. Please login again.");
        setDetecting(false);
        return;
      }

      setVerificationStep('face');
      setFaceStatus('pending');
      console.log(`Starting checkout authentication for: ${currentUser.name} (ID: ${currentUser.numericId})`);

      const authResult = await performThreeStepAuthentication(imageData, currentUser);

      if (authResult.overall_success) {
        setFaceStatus('success');
        setRecognizedName(currentUser.name);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setVerificationStep('id');
        setIdStatus('pending');
        await new Promise(resolve => setTimeout(resolve, 600));
        setIdStatus('success');
        setVerifiedId(currentUser.numericId?.toString() || '');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setVerificationStep('complete');
        await new Promise(resolve => setTimeout(resolve, 1200));
        setVerificationStep("");

        const checkOutResult = await recordCheckOut(currentUser.id);

        if (checkOutResult.success) {
          const { localTimer } = await import('@/lib/services/attendance/timerService');
          localTimer.stop();
          
          setCheckedOut(true);
          
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase/config');
          const today = new Date().toISOString().split('T')[0];
          const attendanceRef = collection(db, "attendance");
          const q = query(attendanceRef, where("userId", "==", currentUser.id), where("date", "==", today));
          const snapshot = await getDocs(q);
          const attendanceData = snapshot.docs[0]?.data();
          
          setCheckOutData({
            name: currentUser.name,
            checkIn: attendanceData?.checkIn,
            checkOut: attendanceData?.checkOut,
            workedHours: checkOutResult.workedHours
          });
          
          setRecognizedEmployee({
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email || "",
            department: currentUser.department || currentUser.Department || "",
            position: currentUser.jobTitle || "",
            username: currentUser.username,
            numericId: currentUser.numericId,
            password: currentUser.password,
          });
          stopCamera();
          
          window.dispatchEvent(new CustomEvent('timerCompleted'));
          
          console.log('✓ Check-out successful:', checkOutResult);
        } else {
          setError(checkOutResult.message);
        }
      } else {
        if (!authResult.step1_face_recognition.success) {
          setFaceStatus('failed');
        } else {
          setFaceStatus('success');
          setRecognizedName(authResult.step1_face_recognition.recognized_name || '');
          
          // Fetch the recognized user's data from Firebase
          try {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase/config');
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", authResult.step1_face_recognition.recognized_name));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              setRecognizedImage(userData.image || "");
              setDetectedUser(userData);
            }
          } catch (err) {
            console.error('Error fetching recognized user data:', err);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          setVerificationStep('id');
          setIdStatus('failed');
          setShowUnauthorizedWarning(true);
          setExpectedUser(currentUser);
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        setVerificationStep("");

        const errorMessage = getDetailedErrorMessage(authResult);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Check-out error:", error);
      setError("Check-out failed. Please try again.");
    } finally {
      setDetecting(false);
    }
  };

  const resetState = () => {
    setError("");
    setMultipleFaces(false);
    setAttendanceMarked(false);
    setRecognizedUser(null);
    setRecognizedEmployee(null);
    setCheckedOut(false);
    setVerificationStep("");
    setFaceStatus('pending');
    setIdStatus('pending');
    setRecognizedName("");
    setVerifiedId("");
    setShowUnauthorizedWarning(false);
    setRecognizedImage("");
    setDetectedUser(null);
    setExpectedUser(null);
  };

  return {
    attendanceMarked,
    recognizedUser,
    recognizedEmployee,
    error,
    attemptsRemaining,
    exhaustedAttempts,
    multipleFaces,
    detecting,
    showAlreadyTakenModal,
    checkedOut,
    checkOutData,
    verificationStep,
    faceStatus,
    idStatus,
    recognizedName,
    verifiedId,
    showUnauthorizedWarning,
    recognizedImage,
    detectedUser,
    expectedUser,
    setShowAlreadyTakenModal,
    processAttendance,
    processCheckOut,
    resetState,
    setError,
  };
}

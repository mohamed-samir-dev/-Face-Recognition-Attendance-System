"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/dashboard/hooks/useAuth";
import { checkDailyAttendance } from "@/lib/services/attendance/dailyAttendanceService";
import CameraLayout from "../layouts/CameraLayout";
import CameraContainer from "../views/containers/CameraContainer";
import { Coffee, ArrowLeft } from "lucide-react";

export default function CameraPageContent() {
  const { user, mounted } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOnLeave, setIsOnLeave] = useState(false);
  const mode = searchParams.get('mode');

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
      return;
    }

    if (mounted && user) {
      if (user.status === 'OnLeave') {
        setIsOnLeave(true);
        return;
      }

      if (mode === 'checkin') {
        checkDailyAttendance(user.id).then((result) => {
          if (result.hasAttendance) {
            const isSupervisor = user.accountType === "Manager" || user.accountType === "Supervisor";
            const redirectPath = isSupervisor ? "/supervisor" : "/userData";
            router.push(`${redirectPath}?showAttendanceWarning=true`);
          }
        });
      }
    }
  }, [mounted, user, router, mode]);

  if (!mounted || !user) {
    return null;
  }

  if (isOnLeave) {
    return (
      <CameraLayout user={user}>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-8 max-w-md text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">You Are Currently On Leave</h2>
            <p className="text-gray-600 mb-6">
              We hope you`&rsquo;`re enjoying your time off. Attendance registration is not available while you are on approved leave.
            </p>
            <button
              onClick={() => {
                const isSupervisor = user.accountType === "Manager" || user.accountType === "Supervisor";
                router.push(isSupervisor ? '/supervisor' : '/userData');
              }}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </CameraLayout>
    );
  }

  return (
    <CameraLayout user={user}>
      <CameraContainer mode={mode || 'checkin'} />
    </CameraLayout>
  );
}

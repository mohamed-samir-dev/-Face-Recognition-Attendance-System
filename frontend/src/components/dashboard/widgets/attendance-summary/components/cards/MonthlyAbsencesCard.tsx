"use client";

import { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import { getMonthlyAbsences } from "@/lib/services/attendance/absenceService";
import { useAuth } from "@/components/dashboard/hooks/useAuth";

export default function MonthlyAbsencesCard() {
  const { user } = useAuth();
  const [absences, setAbsences] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbsences = async () => {
      if (user?.id) {
        try {
          const monthlyAbsences = await getMonthlyAbsences(user.id);
          setAbsences(monthlyAbsences);
        } catch (error) {
          console.error('Error fetching absences:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAbsences();
  }, [user?.id]);

  const getStatusColor = () => {
    if (absences === 0) return "text-green-600 bg-green-50 border-green-200";
    if (absences <= 2) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = () => {
    if (absences === 0) return <Calendar className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700">Monthly Absences</h3>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="text-xl sm:text-2xl font-bold">
          {absences} {absences === 1 ? 'day' : 'days'}
        </div>
        
        <div className="text-xs text-gray-600">
          {absences === 0 ? (
            "Perfect attendance this month! 🎉"
          ) : absences <= 2 ? (
            "Keep up the good work"
          ) : (
            "Consider improving attendance"
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-1 sm:mt-2">
          * Excludes approved leave days
        </div>
      </div>
    </div>
  );
}
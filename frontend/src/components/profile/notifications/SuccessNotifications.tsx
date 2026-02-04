import { CheckCircle } from "lucide-react";

interface SuccessNotificationsProps {
  showSuccess: boolean;
  showPasswordSuccess: boolean;
}

export default function SuccessNotifications({
  showSuccess,
  showPasswordSuccess,
}: SuccessNotificationsProps) {
  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {showPasswordSuccess && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-fade-in border border-white/20">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Password Updated!</p>
            <p className="text-sm text-green-100">Your password has been changed successfully</p>
          </div>
        </div>
      )}
    </>
  );
}
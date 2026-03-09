import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="fixed top-4 right-2 sm:right-4 z-50 animate-in slide-in-from-top-2 duration-300 max-w-[calc(100vw-1rem)] sm:max-w-md">
      <div className={`flex items-start sm:items-center p-3 sm:p-4 rounded-lg border shadow-lg ${getStyles()}`}>
        <div className="shrink-0">{getIcon()}</div>
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium flex-1 leading-relaxed">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 sm:ml-3 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

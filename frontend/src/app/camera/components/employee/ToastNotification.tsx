import toast from 'react-hot-toast';

interface ToastNotificationProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
}

export function showToast({ type, title, message, duration = 3000 }: ToastNotificationProps) {
  const toastContent = (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            {type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );

  const toastOptions = {
    duration,
    position: 'top-center' as const,
    style: {
      background: '#fff',
      color: '#333',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    },
  };

  if (type === 'success') {
    toast.success(toastContent, toastOptions);
  } else {
    toast.error(toastContent, toastOptions);
  }
}
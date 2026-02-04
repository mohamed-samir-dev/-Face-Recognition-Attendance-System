'use client';

interface MessageAlertProps {
  message: { type: 'success' | 'error'; text: string } | null;
}

export default function MessageAlert({ message }: MessageAlertProps) {
  if (!message) return null;

  return (
    <div className={`mt-3 p-3 rounded-lg text-sm ${
      message.type === 'success' 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {message.text}
    </div>
  );
}
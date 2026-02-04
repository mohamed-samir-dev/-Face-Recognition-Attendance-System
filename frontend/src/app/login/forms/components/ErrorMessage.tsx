interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="text-red-600 text-xs sm:text-sm">{message}</p>
    </div>
  );
}

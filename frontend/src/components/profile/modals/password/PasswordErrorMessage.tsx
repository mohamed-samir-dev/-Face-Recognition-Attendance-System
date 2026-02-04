interface PasswordErrorMessageProps {
  error: string | null;
}

export default function PasswordErrorMessage({ error }: PasswordErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-xs sm:text-sm text-red-600">{error}</p>
    </div>
  );
}
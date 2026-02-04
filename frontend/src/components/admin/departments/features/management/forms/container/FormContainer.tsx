'use client';

interface FormContainerProps {
  children: React.ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
      {children}
    </div>
  );
}
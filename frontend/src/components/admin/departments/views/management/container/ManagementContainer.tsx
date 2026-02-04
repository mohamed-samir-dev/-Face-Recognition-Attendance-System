'use client';

interface ManagementContainerProps {
  children: React.ReactNode;
}

export default function ManagementContainer({ children }: ManagementContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      {children}
    </div>
  );
}
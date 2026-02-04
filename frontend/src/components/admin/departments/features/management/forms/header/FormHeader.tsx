'use client';

interface FormHeaderProps {
  title: string;
}

export default function FormHeader({ title }: FormHeaderProps) {
  return (
    <h4 className="font-medium text-gray-900 mb-4">{title}</h4>
  );
}
"use client";

interface ErrorMessageProps {
  error: string;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return <p className="text-red-600 text-sm mt-2">{error}</p>;
}
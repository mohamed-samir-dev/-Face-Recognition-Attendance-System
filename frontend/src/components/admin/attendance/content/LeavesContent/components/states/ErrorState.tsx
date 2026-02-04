interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="p-8 text-center">
      <p className="text-red-600">{error}</p>
    </div>
  );
}
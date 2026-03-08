interface AttemptsCounterProps {
  attemptsRemaining: number;
}

export default function AttemptsCounter({ attemptsRemaining }: AttemptsCounterProps) {
  return (
    <div className="mt-2 sm:mt-3 md:mt-4 text-center">
      <p className="text-xs sm:text-sm text-[#666]">
        Attempts remaining: {attemptsRemaining}
      </p>
    </div>
  );
}
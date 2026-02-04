interface CheckOutButtonProps {
  onCheckOut: () => void;
  isProcessing: boolean;
}

export default function CheckOutButton({ onCheckOut, isProcessing }: CheckOutButtonProps) {
  return (
    <button
      onClick={onCheckOut}
      disabled={isProcessing}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-sm sm:text-base transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isProcessing && (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {isProcessing ? "Processing..." : "Check Out"}
    </button>
  );
}
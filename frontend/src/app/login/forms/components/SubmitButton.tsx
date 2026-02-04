import LoadingSpinner from "./LoadingSpinner";
import { SubmitButtonProps } from "../../types";

export default function SubmitButton({ loading, text, loadingText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
    >
      {loading && <LoadingSpinner />}
      {loading ? loadingText : text}
    </button>
  );
}

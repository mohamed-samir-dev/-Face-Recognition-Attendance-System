import LoadingSpinner from "./LoadingSpinner";
import { SubmitButtonProps } from "../../types";

export default function SubmitButton({ loading, text, loadingText }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-2.5 md:py-3 px-4 rounded-md sm:rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
    >
      {loading && <LoadingSpinner />}
      {loading ? loadingText : text}
    </button>
  );
}

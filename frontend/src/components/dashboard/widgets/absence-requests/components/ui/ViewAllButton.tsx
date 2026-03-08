
import {ViewAllButtonProps} from "../../../../types"
export function ViewAllButton({ totalCount, showAll, onToggle }: ViewAllButtonProps) {
  if (totalCount <= 3) return null;

  return (
    <button
      onClick={onToggle}
      className="w-full mt-2 sm:mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium py-1"
    >
      {showAll ? "Show Less" : `View All (${totalCount})`}
    </button>
  );
}
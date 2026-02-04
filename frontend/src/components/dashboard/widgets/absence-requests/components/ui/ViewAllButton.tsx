
import {ViewAllButtonProps} from "../../../../types"
export function ViewAllButton({ totalCount, showAll, onToggle }: ViewAllButtonProps) {
  if (totalCount <= 3) return null;

  return (
    <button
      onClick={onToggle}
      className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      {showAll ? "Show Less" : `View All (${totalCount})`}
    </button>
  );
}
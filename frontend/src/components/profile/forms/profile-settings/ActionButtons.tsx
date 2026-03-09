import React from "react";
import Button from "@/components/common/buttons/Button";
import { ActionButtonsProps } from "../../types";

export default function ActionButtons({ onCancel, onSave }: ActionButtonsProps) {
  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
      <Button
        variant="secondary"
        onClick={onCancel}
        className="px-4 py-2 w-full sm:w-auto text-xs sm:text-sm lg:text-base"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        className="px-4 py-2 w-full sm:w-auto text-xs sm:text-sm lg:text-base"
      >
        Save Changes
      </Button>
    </div>
  );
}
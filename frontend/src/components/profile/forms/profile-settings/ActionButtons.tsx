import React from "react";
import Button from "@/components/common/buttons/Button";
import { ActionButtonsProps } from "../../types";

export default function ActionButtons({ onCancel, onSave }: ActionButtonsProps) {
  return (
    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
      <Button
        variant="secondary"
        onClick={onCancel}
        className="px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        className="px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base"
      >
        Save Changes
      </Button>
    </div>
  );
}
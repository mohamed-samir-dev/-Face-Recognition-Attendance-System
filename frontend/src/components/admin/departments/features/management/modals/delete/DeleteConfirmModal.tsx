'use client';

import { Trash2 } from 'lucide-react';
import { DeleteConfirmModalProps } from '../../../../types';



export default function DeleteConfirmModal({ department, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-lg shadow-xl max-w-md w-full p-6 border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Department
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{department.name}&rdquo;</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
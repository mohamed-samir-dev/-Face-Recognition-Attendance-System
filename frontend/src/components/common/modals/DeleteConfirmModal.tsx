import { AlertTriangle } from 'lucide-react';
import { DeleteConfirmModalProps } from '../types';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, employeeName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-bold text-black mb-4">Delete Employee Account</h2>
        
        <p className="text-gray-700 mb-8">
          Are you sure you want to delete {employeeName}&apos;s account? This action cannot be undone and all associated data will be permanently lost.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
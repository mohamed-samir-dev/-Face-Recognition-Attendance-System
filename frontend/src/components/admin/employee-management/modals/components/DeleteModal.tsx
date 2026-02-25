'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { DeleteModalProps } from '../../types';



export default function DeleteModal({ isOpen, user, deleting, onConfirm, onCancel }: DeleteModalProps) {
  if (!isOpen || !user) return null;

  let displayImage = user.image;
  try {
    const parsed = JSON.parse(user.image);
    if (parsed.profileImage) displayImage = parsed.profileImage;
    else if (Array.isArray(parsed)) displayImage = parsed[0];
  } catch {}

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/30">
        <div className="relative p-4 lg:p-6 pb-3 lg:pb-4">
          <button
            onClick={onCancel}
            disabled={deleting === user.id}
            className="absolute top-3 right-3 lg:top-4 lg:right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-500 rounded-full flex items-center justify-center shadow-inner">
                <Trash2 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Delete Employee</h2>
            <p className="text-gray-500 text-xs lg:text-sm">This action cannot be undone</p>
          </div>
        </div>

        <div className="px-4 lg:px-6 pb-4 lg:pb-6">
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 lg:p-4 mb-4 lg:mb-6">
            <div className="flex items-center space-x-3">
              {user.image && (
                <img
                  src={displayImage}
                  alt={user.name}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{user.name}</h3>
                <p className="text-xs lg:text-sm text-gray-500">Employee Account</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1 text-sm lg:text-base">Warning</h4>
                <p className="text-xs lg:text-sm text-red-700">
                  Deleting this employee will permanently remove all data.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              disabled={deleting === user.id}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting === user.id}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm lg:text-base"
            >
              {deleting === user.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Deleting...</span>
                  <span className="sm:hidden">Deleting</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete Employee</span>
                  <span className="sm:hidden">Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
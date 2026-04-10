'use client';

import { Edit, Trash2, Key, Bell } from 'lucide-react';
import{UserActionsProps}from "../../../../../types"
import { sendMonitoringAlert } from '@/lib/services/system/monitoringService';
import toast from 'react-hot-toast';

export default function UserActions({ user, deleting, onEdit, onDelete, onChangePassword, hideDelete }: UserActionsProps) {
  const handleSendAlert = async () => {
    if (!user.numericId) return;
    try {
      await sendMonitoringAlert(user.numericId.toString());
      toast.success(`Monitoring alert sent to ${user.name}`);
    } catch  {
      toast.error('Failed to send alert');
    }
  };

  return (
    <div className={`grid gap-2 ${hideDelete ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
      <button 
        onClick={() => onEdit(user.id)}
        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
      >
        <Edit className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Edit</span>
      </button>
      <button 
        onClick={() => onChangePassword?.(user)}
        className="text-green-600 hover:text-green-900 hover:bg-green-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
      >
        <Key className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Password</span>
      </button>
      <button 
        onClick={handleSendAlert}
        className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
        title="Send monitoring alert"
      >
        <Bell className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Alert</span>
      </button>
      {!hideDelete && (
        <button 
          onClick={() => onDelete(user)}
          disabled={deleting === user.id}
          className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-2 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50 transition-all duration-200 cursor-pointer text-xs sm:text-sm"
        >
          <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{deleting === user.id ? 'Deleting...' : 'Delete'}</span>
        </button>
      )}
    </div>
  );
}
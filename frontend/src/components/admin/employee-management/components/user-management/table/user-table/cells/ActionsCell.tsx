'use client';

import { Edit, Trash2, Key, Bell, Smartphone } from 'lucide-react';
import {ActionsCellProps}from "../../../../../types"
import { sendMonitoringAlert } from '@/lib/services/system/monitoringService';
import { resetDeviceBinding } from '@/lib/services/auth/sessionService';
import toast from 'react-hot-toast';


export default function ActionsCell({ user, deleting, onEdit, onDelete, onChangePassword, onResetDevice, hideDelete }: ActionsCellProps) {
  const handleSendAlert = async () => {
    if (!user.numericId) {
      toast.error('User has no numeric ID');
      return;
    }
    try {
      await sendMonitoringAlert(user.numericId.toString());
      toast.success(`Monitoring alert sent to ${user.name}`);
    } catch (error) {
      console.error('[ActionsCell] Failed to send alert:', error);
      toast.error('Failed to send alert');
    }
  };

  const handleResetDevice = async () => {
    try {
      await resetDeviceBinding(user.id);
      toast.success(`Device binding reset for ${user.name}`);
      onResetDevice?.(user);
    } catch {
      toast.error('Failed to reset device binding');
    }
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit(user.id)}
          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded-lg flex items-center space-x-1 transition-all duration-200 cursor-pointer"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onChangePassword?.(user)}
          className="text-green-600 hover:text-green-900 hover:bg-green-50 px-2 py-1 rounded-lg flex items-center space-x-1 transition-all duration-200 cursor-pointer"
        >
          <Key className="w-4 h-4" />
        </button>
        <button 
          onClick={handleSendAlert}
          className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 px-2 py-1 rounded-lg flex items-center space-x-1 transition-all duration-200 cursor-pointer"
          title="Send monitoring alert"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetDevice}
          className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 px-2 py-1 rounded-lg flex items-center space-x-1 transition-all duration-200 cursor-pointer"
          title="Reset device binding"
        >
          <Smartphone className="w-4 h-4" />
        </button>
        {!hideDelete && (
          <button 
            onClick={() => onDelete(user)}
            disabled={deleting === user.id}
            className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center space-x-1 disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting === user.id ? "Deleting..." : ""}</span>
          </button>
        )}
      </div>
    </td>
  );
}
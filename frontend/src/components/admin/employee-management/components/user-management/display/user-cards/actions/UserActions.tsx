'use client';

import { Edit, Trash2, Key } from 'lucide-react';
import{UserActionsProps}from "../../../../../types"


export default function UserActions({ user, deleting, onEdit, onDelete, onChangePassword, hideDelete }: UserActionsProps) {
  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => onEdit(user.id)}
        className="flex-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 cursor-pointer"
      >
        <Edit className="w-4 h-4" />
        <span>Edit</span>
      </button>
      <button 
        onClick={() => onChangePassword?.(user)}
        className="flex-1 text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 cursor-pointer"
      >
        <Key className="w-4 h-4" />
        <span>Password</span>
      </button>
      {!hideDelete && (
        <button 
          onClick={() => onDelete(user)}
          disabled={deleting === user.id}
          className="flex-1 text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 disabled:opacity-50 transition-all duration-200 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting === user.id ? "Deleting..." : "Delete"}</span>
        </button>
      )}
    </div>
  );
}
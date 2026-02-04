'use client';

import { Edit, Trash2, Key } from 'lucide-react';
import {ActionsCellProps}from "../../../../../types"


export default function ActionsCell({ user, deleting, onEdit, onDelete, onChangePassword, hideDelete }: ActionsCellProps) {
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
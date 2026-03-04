'use client';

import { useState } from 'react';
import {EditHeadFieldProps}from "../../../../../../types"
import { X } from 'lucide-react';

export default function EditHeadField({ headId, users, onChange }: EditHeadFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedUser = users.find(u => u.id === headId);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Department Head
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-black bg-white"
        >
          {selectedUser ? selectedUser.name : 'Select department head'}
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Department Head</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-3">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        onChange(user.id, user.name);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 text-left ${
                        headId === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={user.image || '/default-avatar.png'} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{user.jobTitle || 'No Title'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{user.department || 'No Department'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{user.email || 'No Email'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
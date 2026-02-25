'use client';

import { AlertTriangle, User, Building, Briefcase, Hash, Shield, UserCheck, X } from 'lucide-react';

interface EmailWarningModalProps {
  show: boolean;
  existingUser: {
    name: string;
    department: string;
    jobTitle: string;
    numericId: number;
    accountType: string;
    supervisor?: string;
  } | null;
  onClose: () => void;
}

export default function EmailWarningModal({ show, existingUser, onClose }: EmailWarningModalProps) {
  if (!show || !existingUser) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Email Already in Use</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            This email address is already registered to an existing employee:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Name:</span>
              <span className="text-sm font-medium text-gray-900">{existingUser.name}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Employee ID:</span>
              <span className="text-sm font-medium text-gray-900">{existingUser.numericId}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Department:</span>
              <span className="text-sm font-medium text-gray-900">{existingUser.department}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Job Title:</span>
              <span className="text-sm font-medium text-gray-900">{existingUser.jobTitle}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Account Type:</span>
              <span className="text-sm font-medium text-gray-900">{existingUser.accountType}</span>
            </div>
            
            {existingUser.accountType === 'Employee' && existingUser.supervisor && (
              <div className="flex items-center space-x-3">
                <UserCheck className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Supervisor:</span>
                <span className="text-sm font-medium text-gray-900">{existingUser.supervisor}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Please use a different email address for the new employee.
          </p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
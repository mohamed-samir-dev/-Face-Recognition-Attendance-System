"use client";

import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { SuccessModalProps } from "../types";

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  employeeName, 
  username, 
  password, 
  employeeId 
}: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCredentials = () => {
    const text = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Employee Added Successfully!
          </h3>
          
          <p className="text-gray-600 mb-6">
            {employeeName} has been added to the system with ID #{employeeId}
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Login Credentials</h4>
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Username:</span>
                <span className="font-mono text-sm font-medium">{username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Password:</span>
                <span className="font-mono text-sm font-medium">{password}</span>
              </div>
            </div>
            <button
              onClick={copyCredentials}
              className="mt-3 w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy Credentials"}</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-6">
            Please share these credentials with the employee securely.
          </p>
          
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
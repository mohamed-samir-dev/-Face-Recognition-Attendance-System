"use client";

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface VerificationStepsOverlayProps {
  step: 'face' | 'id' | 'complete';
  faceStatus?: 'pending' | 'success' | 'failed';
  idStatus?: 'pending' | 'success' | 'failed';
  recognizedName?: string;
  verifiedId?: string;
}

export default function VerificationStepsOverlay({
  step,
  faceStatus = 'pending',
  idStatus = 'pending',
  recognizedName,
  verifiedId
}: VerificationStepsOverlayProps) {
  
  const getStepIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-4 px-3 z-20 pointer-events-none">
      <div className="bg-linear-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl p-3 max-w-lg w-full border border-gray-700/50 shadow-2xl">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all ${
            faceStatus === 'success' ? 'bg-green-500/20' : 
            faceStatus === 'failed' ? 'bg-red-500/20' :
            step === 'face' ? 'bg-blue-500/20' : 'bg-gray-700/30'
          }`}>
            {getStepIcon(faceStatus)}
            <span className="text-white text-xs font-medium">Face ID</span>
          </div>
          
          <div className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all ${
            idStatus === 'success' ? 'bg-green-500/20' : 
            idStatus === 'failed' ? 'bg-red-500/20' :
            step === 'id' ? 'bg-blue-500/20' : 'bg-gray-700/30'
          }`}>
            {getStepIcon(idStatus)}
            <span className="text-white text-xs font-medium">ID</span>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          {step === 'face' && faceStatus === 'pending' && (
            <p className="text-gray-300 text-xs">🔍 Analyzing facial features...</p>
          )}
          {step === 'face' && faceStatus === 'success' && recognizedName && (
            <p className="text-green-400 text-xs font-medium">✓ Welcome, {recognizedName}!</p>
          )}
          {step === 'id' && idStatus === 'pending' && (
            <p className="text-gray-300 text-xs">🔐 Verifying employee ID...</p>
          )}
          {step === 'id' && idStatus === 'success' && verifiedId && (
            <p className="text-green-400 text-xs font-medium">✓ ID {verifiedId} confirmed</p>
          )}
          {step === 'complete' && (
            <div className="flex items-center justify-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold text-xs">Authentication Complete!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

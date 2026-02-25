'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, Eye, Smile, MoveHorizontal, Loader2, Shield } from 'lucide-react';

interface LivenessCheckProps {
  onComplete: (isLive: boolean, confidence: number) => void;
  onCancel: () => void;
}

interface LivenessResult {
  is_live: boolean;
  confidence: number;
  checks?: Record<string, { passed: boolean }>;
}

const challengeSteps: Record<string, { icon: React.ReactNode; title: string; instruction: string; color: string }> = {
  blink: { icon: <Eye className="w-12 h-12" />, title: 'Blink Detection', instruction: 'Please blink your eyes naturally', color: 'from-blue-500 to-cyan-500' },
  turn_left: { icon: <MoveHorizontal className="w-12 h-12 rotate-180" />, title: 'Head Turn Left', instruction: 'Please turn your head to the left', color: 'from-purple-500 to-pink-500' },
  turn_right: { icon: <MoveHorizontal className="w-12 h-12" />, title: 'Head Turn Right', instruction: 'Please turn your head to the right', color: 'from-orange-500 to-red-500' },
  smile: { icon: <Smile className="w-12 h-12" />, title: 'Smile Detection', instruction: 'Please smile naturally', color: 'from-green-500 to-emerald-500' }
};

const LivenessCheck: React.FC<LivenessCheckProps> = ({ onComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentStep, setCurrentStep] = useState<'init' | 'passive' | 'challenge' | 'verify' | 'complete'>('init');
  const [challenge, setChallenge] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing security check...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkResults, setCheckResults] = useState<LivenessResult | null>(null);

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch  {
      setMessage('Unable to access camera. Please check permissions.');
    }
  };

  const verifyLiveness = useCallback(async () => {
    setCurrentStep('verify');
    setMessage('Verifying authenticity...');
    setProgress(90);
    setIsProcessing(true);
    const finalImage = captureFrame();
    if (!finalImage) return;
    try {
      const response = await fetch('http://localhost:5001/liveness/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, image: finalImage })
      });
      const result = await response.json();
      setCheckResults(result);
      setProgress(100);
      setCurrentStep('complete');
      if (result.is_live) {
        setMessage('✓ Live person verified!');
        setTimeout(() => onComplete(true, result.confidence), 1500);
      } else {
        setMessage('✗ Verification failed');
        setTimeout(() => onComplete(false, result.confidence), 2000);
      }
    } catch  {
      setMessage('Verification error. Please try again.');
      setTimeout(() => onComplete(false, 0), 2000);
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, onComplete]);

  const startChallengePhase = useCallback(() => {
    setCurrentStep('challenge');
    setProgress(70);
    const challengeInfo = challengeSteps[challenge];
    setMessage(challengeInfo?.instruction || 'Follow the instruction');
    let frameCount = 0;
    const interval = setInterval(async () => {
      const imageData = captureFrame();
      if (imageData) {
        await fetch('http://localhost:5001/liveness/submit-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, image: imageData, frame_type: 'challenge' })
        });
      }
      frameCount++;
      if (frameCount >= 5) {
        clearInterval(interval);
        setTimeout(() => verifyLiveness(), 1000);
      }
    }, 400);
  }, [challenge, sessionId, verifyLiveness]);

  const startPassiveCheck = useCallback(async () => {
    setCurrentStep('passive');
    setMessage('Analyzing image quality...');
    setProgress(40);
    const imageData = captureFrame();
    if (!imageData) return;
    try {
      await fetch('http://localhost:5001/liveness/submit-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, image: imageData, frame_type: 'reference' })
      });
      setProgress(60);
      setTimeout(() => startChallengePhase(), 1500);
    } catch (error) {
      console.error('Passive check error:', error);
    }
  }, [sessionId, startChallengePhase]);

  const initializeChallenge = useCallback(async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('http://localhost:5001/liveness/start-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.session_id);
        setChallenge(data.challenge);
        setMessage('Position your face in the frame');
        setProgress(20);
        setTimeout(() => startPassiveCheck(), 2000);
      }
    } catch  {
      setMessage('Connection error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [startPassiveCheck]);

  useEffect(() => {
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [stream]);

  useEffect(() => { if (currentStep === 'init') initializeChallenge(); }, [currentStep, initializeChallenge]);

  const currentChallengeStep = challengeSteps[challenge];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-700">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Liveness Verification</h2>
                <p className="text-indigo-100 text-sm">Advanced anti-spoofing security</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="bg-gray-800 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-bold text-indigo-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-linear-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="relative p-6">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-80 border-4 border-dashed border-indigo-400 rounded-full animate-pulse">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-500 rounded-full" />
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-indigo-500 rounded-full" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-indigo-500 rounded-full" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-indigo-500 rounded-full" />
              </div>
            </div>
            {currentStep === 'challenge' && currentChallengeStep && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-linear-to-r ${currentChallengeStep.color} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3`}>
                {currentChallengeStep.icon}
                <span className="font-semibold">{currentChallengeStep.instruction}</span>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-center gap-3">
            {isProcessing && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
            <p className="text-lg font-medium text-gray-200">{message}</p>
          </div>
          {checkResults && currentStep === 'complete' && (
            <div className="mt-4 space-y-2">
              {checkResults.is_live ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confidence: {(checkResults.confidence * 100).toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>Verification Failed</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivenessCheck;

"use client";

import { Eye, Smile, MoveHorizontal } from 'lucide-react';

interface LivenessChallengeOverlayProps {
  challenge: string;
  progress: number;
  message: string;
}

const challengeConfig: Record<string, any> = {
  blink: { icon: Eye, title: 'Blink Detection', color: 'from-blue-500 to-cyan-500' },
  turn_left: { icon: MoveHorizontal, title: 'Turn Left', color: 'from-purple-500 to-pink-500', rotate: true },
  turn_right: { icon: MoveHorizontal, title: 'Turn Right', color: 'from-orange-500 to-red-500' },
  smile: { icon: Smile, title: 'Smile', color: 'from-green-500 to-emerald-500' }
};

export default function LivenessChallengeOverlay({ challenge, progress, message }: LivenessChallengeOverlayProps) {
  const config = challengeConfig[challenge];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
      <div className={`bg-gradient-to-r ${config.color} text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce mb-6`}>
        <div className="flex items-center gap-4">
          <Icon className={`w-10 h-10 ${config.rotate ? 'rotate-180' : ''}`} />
          <span className="font-bold text-xl">{config.title}</span>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg max-w-md">
        <p className="text-gray-800 font-semibold text-center mb-3">{message}</p>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${config.color} h-full rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

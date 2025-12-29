
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM...");

  const statusMessages = [
    "LOADING NEURAL NETWORKS...",
    "SYNCING FRAME BUFFERS...",
    "ESTABLISHING LINK-NODE CONNECTION...",
    "DECODING MONOCHROME ASSETS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    const messageTimer = setInterval(() => {
      setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] p-8">
      {/* Old School Anime Screen Border */}
      <div className="absolute inset-4 border border-white/20 pointer-events-none" />
      <div className="absolute inset-8 border border-white/10 pointer-events-none" />
      
      <div className="w-full max-w-md">
        <div className="flex justify-between items-end mb-2">
          <div className="text-white font-bold tracking-tighter text-xl italic uppercase">
            Loading...
          </div>
          <div className="text-white font-mono text-xs opacity-60">
            {progress}% COMPLETE
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 border border-white p-[2px]">
          <div 
            className="h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 flex gap-2">
          <div className="animate-pulse w-2 h-4 bg-white" />
          <div className="text-white font-mono text-[10px] tracking-[0.2em] uppercase opacity-80 truncate">
            {statusText}
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12">
        <div className="text-[10px] text-white/40 font-mono tracking-widest leading-relaxed">
          VER: 1.0.4<br />
          SOURCE: SYSTEM_A1
        </div>
      </div>
      
      <div className="absolute top-12 right-12">
         <div className="w-8 h-8 border-t-2 border-r-2 border-white opacity-40" />
      </div>
    </div>
  );
};

export default LoadingScreen;

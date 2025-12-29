
import React, { useMemo } from 'react';

const CherryBlossoms: React.FC = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`,
      size: `${10 + Math.random() * 15}px`,
      opacity: 0.1 + Math.random() * 0.4,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute text-white animate-fall"
          style={{
            left: p.left,
            top: '-10%',
            fontSize: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation})`,
          }}
        >
          {/* Using a simple blossom-like SVG or character in white for the B&W theme */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: '1em', height: '1em' }}
          >
            <path d="M12,2L10.5,8.5L4,10L10.5,11.5L12,18L13.5,11.5L20,10L13.5,8.5L12,2Z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(15px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-15px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(15px) rotate(270deg);
          }
          100% {
            transform: translateY(110vh) translateX(0px) rotate(360deg);
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default CherryBlossoms;


import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[10000] flex items-center justify-center transition-transform duration-100 ease-out"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${isPointer ? 'scale(1.5)' : 'scale(1)'}`
      }}
    >
      {/* Main Crosshair */}
      <div className="absolute w-8 h-[1px] bg-white opacity-80" />
      <div className="absolute h-8 w-[1px] bg-white opacity-80" />
      
      {/* Circle Frame */}
      <div className={`absolute border border-white rounded-full transition-all duration-300 ${isPointer ? 'w-10 h-10 opacity-100' : 'w-4 h-4 opacity-50'}`} />
      
      {/* Corner Brackets */}
      {isPointer && (
        <>
          <div className="absolute -top-3 -left-3 w-2 h-2 border-t border-l border-white" />
          <div className="absolute -top-3 -right-3 w-2 h-2 border-t border-r border-white" />
          <div className="absolute -bottom-3 -left-3 w-2 h-2 border-b border-l border-white" />
          <div className="absolute -bottom-3 -right-3 w-2 h-2 border-b border-r border-white" />
        </>
      )}
    </div>
  );
};

export default CustomCursor;


import React, { useState } from 'react';
import { Link } from '../types';

interface LinkItemProps {
  link: Link;
  index: number;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group w-full block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden border transition-all duration-500 transform
        ${isHovered ? 'bg-white text-black -translate-x-2 -translate-y-2 border-white' : 'bg-black/40 backdrop-blur-md text-white border-white/40'}
        px-8 py-5 flex items-center justify-between
      `}>
        {/* Hover Background Glitch effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-white mix-blend-difference opacity-5 animate-pulse pointer-events-none" />
        )}

        <div className="flex items-center gap-6">
          <span className={`text-[10px] font-mono transition-colors duration-300 ${isHovered ? 'text-black' : 'text-white/40'}`}>
            0{index + 1}.
          </span>
          <span className="text-sm font-black tracking-[0.2em] uppercase">
            {link.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-[9px] font-['Noto_Sans_JP'] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            開く
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-4 h-4 transition-transform duration-500 ${isHovered ? 'translate-x-1' : ''}`}
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Decorative Shadow/Frame - Only visible when not hovered for a 'stacked' look */}
      {!isHovered && (
        <div className="absolute inset-0 border border-white/10 translate-x-1 translate-y-1 -z-10" />
      )}
    </a>
  );
};

export default LinkItem;

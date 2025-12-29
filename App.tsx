
import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import LinkItem from './components/LinkItem';
import MusicPlayer from './components/MusicPlayer';
import CherryBlossoms from './components/CherryBlossoms';
import { CONFIG, JP_DECO } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-['JetBrains_Mono'] overflow-x-hidden">
      <CustomCursor />
      <MusicPlayer />
      <CherryBlossoms />
      
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={CONFIG.avatar} 
          alt="Background" 
          className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[0.25] scale-105"
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Japanese Decorative Elements */}
      <div className="fixed top-12 right-8 z-20 pointer-events-none hidden md:block">
        <div className="vertical-text text-4xl font-black font-['Noto_Sans_JP'] opacity-20 tracking-widest leading-none">
          {JP_DECO.title}
        </div>
      </div>

      <div className="fixed bottom-24 left-8 z-20 pointer-events-none hidden lg:block">
        <div className="vertical-text text-sm font-['Noto_Sans_JP'] opacity-40 tracking-[0.5em] uppercase">
          {JP_DECO.side}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <header className="mb-20 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 opacity-50">
              <div className="h-[2px] w-8 bg-white" />
              <span className="text-[10px] tracking-[0.3em] font-['Noto_Sans_JP']">{JP_DECO.subtitle}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
              {CONFIG.name.split(' ')[0]}<br />
              <span className="text-outline-white text-transparent" style={{ WebkitTextStroke: '1px white' }}>
                {CONFIG.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white text-black px-3 py-1 text-xs font-bold tracking-[0.2em]">
                {CONFIG.handle}
              </div>
              <div className="text-[10px] opacity-40 font-mono">ID: 0x92-F1-AC</div>
            </div>

            <p className="text-sm font-mono tracking-tight opacity-80 border-l-4 border-white pl-4 max-w-xs leading-relaxed">
              {CONFIG.bio}
            </p>
          </div>
        </header>

        {/* Links Grid */}
        <div className="space-y-8 mb-32">
          {CONFIG.links.map((link, idx) => (
            <LinkItem key={idx} link={link} index={idx} />
          ))}
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-white/20 flex justify-between items-center opacity-40">
           <div className="text-[9px] font-mono tracking-[0.4em] uppercase">
            EST. 2024 / SYSTEM_CORE
          </div>
          <div className="text-[10px] font-['Noto_Sans_JP']">
            終了
          </div>
        </footer>
      </main>

      {/* Corner Brackets */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/10 m-4 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/10 m-4 pointer-events-none" />
    </div>
  );
};

export default App;

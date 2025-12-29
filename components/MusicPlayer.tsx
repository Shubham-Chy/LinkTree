import React, { useState, useEffect, useRef } from "react";
import { CONFIG, JP_DECO } from "../constants";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [frequencies, setFrequencies] = useState<number[]>(
    new Array(8).fill(0)
  );

  const currentTrack = CONFIG.playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume to a very low background level (0.1)
    audio.volume = 0.1;

    const setupVisualizer = () => {
      if (analyzerRef.current) return;

      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const source = audioContext.createMediaElementSource(audio);
        const analyzer = audioContext.createAnalyser();

        analyzer.fftSize = 64;
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzerRef.current = analyzer;
      } catch (e) {
        console.warn("Web Audio API not supported or blocked", e);
      }
    };

    const updateVisualizer = () => {
      if (!analyzerRef.current || audio.paused) {
        setFrequencies(new Array(8).fill(0));
        animationRef.current = requestAnimationFrame(updateVisualizer);
        return;
      }

      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyzerRef.current.getByteFrequencyData(dataArray);

      const newFrequencies = [];
      const step = Math.floor(bufferLength / 8);
      for (let i = 0; i < 8; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j];
        }
        newFrequencies.push(sum / step);
      }

      setFrequencies(newFrequencies);
      animationRef.current = requestAnimationFrame(updateVisualizer);
    };

    const playAudio = async () => {
      if (!audioRef.current) return;
      try {
        setupVisualizer();
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        // This is expected if user hasn't interacted with the page yet.
        console.log("Autoplay waiting for first interaction...");
      }
    };

    // Most browsers block audio until any user interaction.
    // We listen for multiple event types to catch the interaction as soon as it happens.
    const interactionEvents = [
      "click",
      "keydown",
      "touchstart",
      "mousedown",
      "mousemove",
    ];

    const handleInteraction = () => {
      playAudio();
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };

    interactionEvents.forEach((event) =>
      window.addEventListener(event, handleInteraction)
    );

    // Try playing once immediately (works if browser allows or user already interacted)
    playAudio();

    animationRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTrackEnd = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % CONFIG.playlist.length);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      {/* Now Playing Info */}
      <div
        className={`flex flex-col items-end transition-opacity duration-500 ${
          isPlaying && !isMuted ? "opacity-60" : "opacity-20"
        }`}
      >
        <span className="text-[10px] font-['Noto_Sans_JP'] tracking-widest uppercase">
          {JP_DECO.audio}
        </span>
        <div className="flex items-center gap-2">
          {isPlaying && !isMuted && (
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          )}
          <span className="text-[9px] font-mono truncate max-w-[150px] uppercase tracking-tighter">
            {currentTrack?.title} // {currentTrack?.artist}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Dynamic Visualizer Bar Cluster */}
        <div className="flex items-end gap-[1px] h-12 px-3 border border-white/10 bg-black/20 backdrop-blur-sm pointer-events-none">
          {frequencies.map((f, i) => (
            <div
              key={i}
              className="w-[3px] bg-white transition-all duration-75 ease-out"
              style={{
                height: `${Math.max(4, (f / 255) * 100)}%`,
                opacity: 0.1 + (f / 255) * 0.9,
              }}
            />
          ))}
        </div>

        {/* Control Button: Single click to mute/unmute, Double click to play/pause */}
        <button
          onClick={toggleMute}
          onDoubleClick={handlePlayPause}
          title="Click to Mute/Unmute, Double Click to Play/Pause"
          className="group relative w-12 h-12 flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 overflow-hidden"
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <div className="relative flex items-center justify-center">
              {!isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <div className="flex gap-[3px]">
                  <div className="w-[3px] h-4 bg-current" />
                  <div className="w-[3px] h-4 bg-current" />
                </div>
              )}
            </div>
          )}
          <div className="absolute top-0 right-0 w-1 h-1 bg-white/20" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onEnded={handleTrackEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        preload="auto"
      />
    </div>
  );
};

export default MusicPlayer;

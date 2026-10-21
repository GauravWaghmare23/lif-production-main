import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { Volume2, VolumeX, Aperture } from 'lucide-react';

interface LoaderProps {
  onEnter: (soundEnabled: boolean) => void;
}

export const Loader: React.FC<LoaderProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const telemetryLines = [
    '01 // INITIALIZING OPTICAL SYSTEMS & GOLDEN ANAMORPHIC SENSORS...',
    '02 // LOADING 35MM KODAK 5219 FILM GRAIN EMULSION SHADER...',
    '03 // CALIBRATING THREE.JS 3D REFRACTIVE LENS CHAMBER...',
    '04 // TUNING DOLBY BINAURAL SUB-DRONE FREQUENCY MATRIX...',
    '05 // CALIBRATION COMPLETE. ALL 4K FRAMES SYNCHRONIZED.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 35);

    const telemetryTimer = setInterval(() => {
      setTelemetryIndex((prev) => (prev < telemetryLines.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(telemetryTimer);
    };
  }, []);

  const handleEnter = (withSound: boolean) => {
    soundEngine.setMuted(!withSound);
    soundEngine.playShutter();
    soundEngine.playWhoosh();
    setIsExiting(true);

    setTimeout(() => {
      onEnter(withSound);
    }, 900);
  };

  return (
    <div 
      className={`fixed inset-0 z-[10000] bg-[#050505] flex flex-col justify-between p-6 md:p-12 transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isExiting ? 'opacity-0 pointer-events-none scale-105 filter blur-sm' : 'opacity-100'
      }`}
    >
      {/* Top Technical Metadata Bar */}
      <div className="flex items-center justify-between font-mono text-[11px] text-cine-muted tracking-widest uppercase border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2 h-2 rounded-full bg-cine-gold animate-ping shadow-[0_0_8px_#FFB800]" />
          <span className="text-cine-gold font-bold">SYSTEM // INITIALIZING</span>
        </div>
        <div className="hidden sm:flex items-center space-x-6">
          <span>FPS: 24.00</span>
          <span>SHUTTER: 180.0°</span>
          <span className="text-cine-gold">COLOR: ACES 1.3</span>
        </div>
        <div>
          <span className="text-cine-gold font-bold">{progress.toString().padStart(3, '0')}%</span>
        </div>
      </div>

      {/* Center Cinematic Brand Core */}
      <div className="my-auto text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated Golden Aperture Icon */}
        <div className="mb-6 relative">
          <Aperture className="w-14 h-14 text-cine-gold animate-spin-slow drop-shadow-[0_0_20px_rgba(255,184,0,0.6)]" />
          <div className="absolute inset-0 w-14 h-14 bg-cine-gold/20 rounded-full filter blur-xl animate-pulse" />
        </div>

        {/* Monumental Headline */}
        <h1 className="font-condensed-hero text-6xl sm:text-8xl md:text-9xl text-warm-white tracking-tighter leading-none mb-3 select-none">
          LOST IN FRAME
        </h1>
        
        <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-cine-gold uppercase font-bold mb-8 drop-shadow-[0_0_10px_rgba(255,184,0,0.3)]">
          WE DON'T MAKE CONTENT. WE CREATE WORLDS.
        </p>

        {/* Real-time Progress Bar */}
        <div className="w-full max-w-md bg-white/10 h-[2px] overflow-hidden mb-6 relative rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-cine-orange via-cine-amber to-cine-gold transition-all duration-100 ease-out shadow-[0_0_15px_#FFB800]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Log */}
        <p className="font-mono text-xs text-cine-muted h-6 tracking-wider">
          {telemetryLines[telemetryIndex]}
        </p>

        {/* Enter Actions */}
        <div 
          className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-500 ${
            isReady ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={() => handleEnter(true)}
            data-cursor="ENTER"
            className="group relative px-8 py-4 bg-gradient-to-r from-cine-orange via-cine-amber to-cine-gold text-black font-mono text-xs font-black tracking-widest uppercase rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,184,0,0.6)] flex items-center space-x-3"
          >
            <Volume2 className="w-4 h-4 text-black" />
            <span>ENTER THE FRAME (WITH SOUND)</span>
            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <button
            onClick={() => handleEnter(false)}
            data-cursor="ENTER"
            className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-cine-gold/30 hover:border-cine-gold text-cine-muted hover:text-cine-gold font-mono text-xs tracking-widest uppercase rounded-sm transition-all duration-300 flex items-center space-x-2"
          >
            <VolumeX className="w-4 h-4" />
            <span>ENTER SILENT</span>
          </button>
        </div>
      </div>

      {/* Bottom Production Footer */}
      <div className="flex items-center justify-between font-mono text-[11px] text-cine-muted tracking-widest uppercase border-t border-white/10 pt-4">
        <div>
          <span>MEDIA PRODUCTION HOUSE // EST. 2018</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-cine-gold">GOLDEN ANAMORPHIC CINEMATOGRAPHY</span>
          <span>© 2026 LOST IN FRAME</span>
        </div>
      </div>
    </div>
  );
};

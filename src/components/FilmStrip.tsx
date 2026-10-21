import React, { useRef } from 'react';
import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/projects';
import { soundEngine } from '../utils/audioSynth';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FilmStripProps {
  onSelectProject: (project: Project) => void;
}

export const FilmStrip: React.FC<FilmStripProps> = ({ onSelectProject }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -420 : 420;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    soundEngine.playLensTick(1.3);
  };

  return (
    <section className="py-24 bg-[#050505] border-t border-white/10 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-cine-gold font-mono text-xs tracking-widest uppercase mb-1">
            <span className="w-1.5 h-1.5 bg-cine-gold rounded-full shadow-[0_0_8px_#00F0FF]" />
            <span>06 // 35MM CONTINUOUS STRIP</span>
          </div>
          <h2 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white tracking-tight">
            THE PHYSICAL REEL
          </h2>
        </div>

        {/* Scroll Arrows with Golden Hover */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            data-cursor="PREV"
            className="p-3 rounded-full bg-white/5 hover:bg-cine-gold hover:text-black border border-cine-gold/30 text-white transition-all duration-300 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            data-cursor="NEXT"
            className="p-3 rounded-full bg-white/5 hover:bg-cine-gold hover:text-black border border-cine-gold/30 text-white transition-all duration-300 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 35mm Perforated Sprocket Film Track */}
      <div className="relative w-full overflow-hidden bg-black/95 py-6 border-y border-white/10">
        
        {/* Top Sprockets */}
        <div className="w-full flex space-x-4 px-4 mb-3 opacity-40 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-[2px] bg-cine-gold/40 flex-shrink-0 border border-black" />
          ))}
        </div>

        {/* Horizontal Film Frames Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto px-6 md:px-12 scrollbar-none py-2 scroll-smooth"
        >
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                soundEngine.playShutter();
                onSelectProject(project);
              }}
              onMouseEnter={() => soundEngine.playLensTick(1.1)}
              data-cursor="FRAME"
              className="flex-shrink-0 w-80 sm:w-96 group cursor-pointer bg-[#0e0e11] p-3 rounded-sm border border-white/15 hover:border-cine-gold transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              {/* Frame Media */}
              <div className="relative aspect-video rounded-sm overflow-hidden bg-black mb-3">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover filter brightness-85 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded font-mono text-[10px] text-cine-gold border border-cine-gold/30">
                  CELL #{idx + 1}04
                </div>
              </div>

              {/* Frame Info */}
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <h4 className="font-condensed-hero text-2xl text-warm-white group-hover:text-cine-gold transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-[10px] text-cine-muted uppercase">{project.category}</p>
                </div>
                <span className="text-[10px] text-cine-gold bg-cine-gold/10 px-2 py-1 rounded border border-cine-gold/20">
                  {project.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sprockets */}
        <div className="w-full flex space-x-4 px-4 mt-3 opacity-40 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-[2px] bg-cine-gold/40 flex-shrink-0 border border-black" />
          ))}
        </div>

      </div>
    </section>
  );
};

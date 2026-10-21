import React, { useState, useRef } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { STATS_DATA } from '../data/brands';
import { section } from '../data/site';

export const StatsAndClients: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Cards come from src/data/stats.json, labels from sections.json → "stats"
  const stats = STATS_DATA;
  const t = section('stats');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    if (activeIdx !== idx) setActiveIdx(idx);
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
  };

  return (
    <section className="py-24 bg-[#000000] border-t border-white/10 select-none overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <h2 className="font-sans text-5xl sm:text-6xl font-medium text-white tracking-tight leading-none mb-16 uppercase">
          {t.title}
        </h2>

        {/* 4 Vertical Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#222222]">
          {stats.map((stat, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <div
                key={idx}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseEnter={() => {
                  setActiveIdx(idx);
                  soundEngine.playLensTick(1.2);
                }}
                onMouseLeave={handleMouseLeave}
                className="relative border-b sm:border-b-0 border-r border-[#222222] p-8 min-h-[520px] flex flex-col justify-between group overflow-hidden cursor-pointer transition-colors hover:bg-white/[0.02]"
              >
                {/* Top Left Code Label (a ], b ], c ], d ]) */}
                <div className="font-mono text-sm text-white/40 tracking-wider">
                  {stat.code}
                </div>

                {/* Floating Follower Photo — ONLY appears on hover and follows cursor */}
                <div
                  className="absolute w-52 aspect-[3/4] rounded-sm overflow-hidden border border-[#00F0FF]/80 shadow-[0_20px_50px_rgba(0,102,255,0.4)] z-30 pointer-events-none transition-all duration-200 ease-out"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? `translate3d(${cursorPos.x - 104}px, ${cursorPos.y - 130}px, 0) scale(1)`
                      : 'translate3d(50%, 50%, 0) scale(0.85)',
                  }}
                >
                  <img
                    src={stat.photo}
                    alt={stat.label}
                    className="w-full h-full object-cover filter contrast-125 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Stat Number & Sub-label */}
                <div className="relative z-10 my-auto">
                  <span
                    className={`font-sans text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight block transition-all duration-300 ${
                      stat.highlight || isHovered
                        ? 'bg-gradient-to-r from-[#0052FF] via-[#0EA5E9] to-[#00F0FF] bg-clip-text text-transparent'
                        : 'text-white'
                    }`}
                  >
                    {stat.number}
                  </span>

                  <p className="font-mono text-xs text-white/60 tracking-wider mt-4 uppercase font-medium">
                    {stat.label}
                  </p>
                </div>

                {/* Bottom Corner Dot */}
                <div className="flex items-center justify-between font-mono text-[10px] text-white/30 pt-4 border-t border-white/5">
                  <span>{t.hoverLabel}</span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isHovered ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]' : 'bg-white/20'}`} />
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

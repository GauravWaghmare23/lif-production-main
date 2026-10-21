import React, { useState } from 'react';
import { TEAM_DATA } from '../data/team';
import { soundEngine } from '../utils/audioSynth';
import { section, eyebrow } from '../data/site';

export const TeamCredits: React.FC = () => {
  // Crew comes from src/data/team.json, labels from sections.json → "team"
  const t = section('team');
  const [activeMember, setActiveMember] = useState(TEAM_DATA[0]);

  const handleHover = (member: typeof TEAM_DATA[0]) => {
    setActiveMember(member);
    soundEngine.playLensTick(1.2);
  };

  return (
    <section id="team" className="relative py-28 md:py-40 bg-[#050505] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex items-center justify-between font-mono text-xs text-cine-muted tracking-widest uppercase border-b border-white/10 pb-4 mb-16">
          <div className="flex items-center space-x-2 text-cine-gold">
            <span className="w-1.5 h-1.5 bg-cine-gold rounded-full shadow-[0_0_8px_#00F0FF]" />
            <span>{eyebrow('team')}</span>
          </div>
          <span>{t.eyebrowRight}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Spotlight Talent Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-cine-gold/30 bg-[#0b0b0e] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <img
                src={activeMember.portrait}
                alt={activeMember.name}
                className="w-full h-full object-cover filter grayscale contrast-125 transition-all duration-700 ease-out scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-mono text-xs text-cine-gold tracking-widest uppercase block mb-1 font-bold">
                  {activeMember.role}
                </span>
                <h3 className="font-condensed-hero text-4xl text-warm-white tracking-tight">
                  {activeMember.name}
                </h3>
                <p className="font-sans text-xs text-cine-muted mt-2 line-clamp-3">
                  {activeMember.bio}
                </p>

                {/* Credits Pill */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                  {activeMember.credits.slice(0, 2).map((c, i) => (
                    <span key={i} className="font-mono text-[9px] bg-white/10 border border-white/15 px-2 py-0.5 rounded text-warm-white">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Film Credits Style Crew Roster */}
          <div className="lg:col-span-7 space-y-2">
            <div className="font-mono text-xs text-cine-muted tracking-widest uppercase mb-6 flex items-center justify-between border-b border-white/10 pb-3">
              <span>{t.rosterLabel}</span>
              <span>{t.departmentLabel}</span>
            </div>

            {TEAM_DATA.map((member) => {
              const isActive = activeMember.id === member.id;
              return (
                <div
                  key={member.id}
                  onMouseEnter={() => handleHover(member)}
                  data-cursor="CREW"
                  className={`group cursor-pointer py-4 px-4 rounded-sm transition-all duration-300 flex items-center justify-between border-b border-white/5 ${
                    isActive
                      ? 'bg-white/5 border-l-2 border-l-cine-gold text-warm-white'
                      : 'hover:bg-white/[0.02] text-cine-muted hover:text-warm-white'
                  }`}
                >
                  <div>
                    <span className="font-mono text-[10px] text-cine-muted block uppercase tracking-wider">
                      {member.role.split('&')[0]}
                    </span>
                    <h4 className={`font-condensed-hero text-3xl md:text-4xl tracking-tight transition-colors ${
                      isActive ? 'text-cine-gold' : 'group-hover:text-warm-white'
                    }`}>
                      {member.name}
                    </h4>
                  </div>

                  <span className="font-mono text-xs text-cine-muted group-hover:text-cine-gold hidden sm:inline">
                    {member.department}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { soundEngine } from '../utils/audioSynth';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { SITE } from '../data/site';

interface FooterProps {
  onOpenInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquiry }) => {
  const scrollToTop = () => {
    soundEngine.playShutter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Socials, legal links and copy come from src/data/site.json
  const socials = SITE.socials;
  const footer = SITE.footer;

  return (
    <footer className="bg-[#000000] border-t border-white/10 text-white pt-24 pb-12 select-none">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Massive Call to Action Section */}
        <div className="mb-20 pb-16 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-[#0066FF] uppercase tracking-widest block mb-3 font-bold">
              {footer.eyebrow}
            </span>
            <h2 className="font-sans text-5xl sm:text-7xl font-medium text-white tracking-tight leading-none">
              {footer.headline[0]} <br />
              {footer.headline[1]}
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playShutter();
              onOpenInquiry();
            }}
            className="cta-btn text-base px-8 py-4 group"
          >
            <span>{SITE.cta.footer}</span>
            <div className="cta-btn-arrow w-5 h-5">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>

        {/* Social Links Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-b border-white/10 mb-12 font-sans text-sm">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playLensTick(1.2)}
              className="text-white/70 hover:text-[#0066FF] transition-colors flex items-center justify-between group"
            >
              <span>{s.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#0066FF]" />
            </a>
          ))}
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-white/40">
          <div>
            {footer.copyright}
          </div>

          <div className="flex items-center space-x-6">
            {footer.legal.map((l) => (
              <a key={l.label} href={l.url} className="hover:text-white transition-colors">{l.label}</a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 hover:text-[#0066FF] transition-colors"
          >
            <span>{footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};

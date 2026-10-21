import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audioSynth';
import { ArrowUpRight, Volume2, VolumeX, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { SITE, scrollToSection } from '../data/site';

interface HeaderProps {
  soundActive: boolean;
  onToggleSound: () => void;
  onOpenInquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundActive,
  onToggleSound,
  onOpenInquiry
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Nav links come from src/data/site.json
  const navLinks = SITE.nav.map((n) => ({ label: n.label, href: n.target }));

  const handleNavClick = (href: string) => {
    soundEngine.playLensTick(1.0);
    setMobileMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/90 backdrop-blur-md border-b border-white/10 py-4'
          : 'bg-gradient-to-b from-[#000000]/80 via-[#000000]/30 to-transparent py-6'
      }`}
    >
      <div className={clsx('max-w-[1440px]', 'mx-auto', 'px-6', 'md:px-12', 'flex', 'items-center', 'justify-between')}>
        
        {/* Brand Mark (Exact Charles Alexander logo aesthetic) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playShutter();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={clsx('flex', 'items-center', 'space-x-3', 'text-white', 'group')}
        >
          <div className={clsx('w-8', 'h-8', 'rounded-full', 'border', 'border-white/30', 'flex', 'items-center', 'justify-center', 'font-bold', 'text-xs', 'group-hover:border-[#0066FF]', 'transition-colors')}>
            {SITE.brand.name.split(' ').map((w) => w[0]).join('')}
          </div>
          <span className={clsx('font-sans', 'text-sm', 'tracking-wider', 'font-semibold', 'text-white', 'uppercase', 'group-hover:text-[#0066FF]', 'transition-colors')}>
            {SITE.brand.name}
          </span>
        </a>

        {/* Center Nav Links with Slide-up Effect */}
        <nav className={clsx('hidden', 'md:flex', 'items-center', 'space-x-10')}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="nav-link-slide"
            >
              <span className="nav-text-1">{link.label}</span>
              <span className="nav-text-2">{link.label}</span>
            </button>
          ))}
        </nav>

        {/* Right CTA Actions (Exact Charles Alexander "CONTACT ↗" red button) */}
        <div className={clsx('flex', 'items-center', 'space-x-4')}>
          
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playLensTick(1.1);
            }}
            className={clsx('hidden', 'sm:flex', 'items-center', 'space-x-1.5', 'text-xs', 'text-white/60', 'hover:text-white', 'transition-colors')}
            title="Toggle Audio"
          >
            {soundActive ? <Volume2 className={clsx('w-3.5', 'h-3.5', 'text-[#0066FF]')} /> : <VolumeX className={clsx('w-3.5', 'h-3.5')} />}
            <span className={clsx('font-mono', 'text-[10px]', 'uppercase')}>{soundActive ? SITE.cta.soundOn : SITE.cta.soundOff}</span>
          </button>

          {/* Contact Button with Red Arrow Box */}
          <button
            onClick={() => {
              soundEngine.playShutter();
              onOpenInquiry();
            }}
            className={clsx('cta-btn', 'group')}
          >
            <span>{SITE.cta.header}</span>
            <div className="cta-btn-arrow">
              <ArrowUpRight className={clsx('w-3', 'h-3', 'text-white')} />
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={clsx('md:hidden', 'p-2', 'text-white')}
          >
            {mobileMenuOpen ? <X className={clsx('w-6', 'h-6')} /> : <Menu className={clsx('w-6', 'h-6')} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={clsx('md:hidden', 'fixed', 'inset-0', 'top-[70px]', 'bg-[#000000]/98', 'backdrop-blur-2xl', 'p-8', 'flex', 'flex-col', 'justify-between', 'z-40', 'border-t', 'border-white/10')}>
          <div className={clsx('space-y-6', 'pt-4')}>
            {navLinks.map((link, idx) => (
              <div key={link.label} className={clsx('border-b', 'border-white/10', 'pb-4')}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={clsx('font-sans', 'text-3xl', 'font-light', 'text-white', 'hover:text-[#0066FF]', 'transition-colors', 'flex', 'items-center', 'justify-between', 'w-full', 'text-left')}
                >
                  <span>{link.label}</span>
                  <span className={clsx('font-mono', 'text-xs', 'text-[#0066FF]')}>0{idx + 1}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className={clsx('w-full', 'py-4', 'bg-[#0066FF]', 'text-white', 'font-sans', 'text-sm', 'tracking-wider', 'uppercase', 'font-semibold', 'text-center', 'flex', 'items-center', 'justify-center', 'space-x-2')}
            >
              <span>{SITE.cta.mobile}</span>
              <ArrowUpRight className={clsx('w-4', 'h-4')} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { SECTION_ORDER, SECTIONS, sectionDomId, sectionNumber } from '../data/site';
import { soundEngine } from '../utils/audioSynth';

/**
 * Scroll progress bar + side dot navigation.
 *
 *  - The top line fills as you scroll the page.
 *  - The dots (desktop) show where you are and jump to any section.
 *  - Which sections appear is controlled by "nav": true/false in
 *    src/data/sections.json, and their order by the "order" array.
 */
export const SectionNav: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>(SECTION_ORDER[0]);

  const navItems = SECTION_ORDER.filter((id) => SECTIONS[id]?.nav);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      // Progress bar
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      setVisible(window.scrollY > window.innerHeight * 0.35);

      // Active section = last nav section whose top has passed the probe line
      const probe = window.innerHeight * 0.4;
      let current = navItems[0];
      for (const id of navItems) {
        const el = document.getElementById(sectionDomId(id));
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (id: string) => {
    soundEngine.playLensTick(1.1);
    document
      .getElementById(sectionDomId(id))
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll progress line */}
      <div
        aria-hidden="true"
        className={clsx('fixed', 'top-0', 'left-0', 'right-0', 'h-[2px]', 'z-[60]', 'pointer-events-none', 'bg-white/5')}
      >
        <div
          ref={barRef}
          className={clsx('h-full', 'w-full', 'origin-left', 'scale-x-0', 'bg-gradient-to-r', 'from-[#0052FF]', 'via-[#0EA5E9]', 'to-[#00F0FF]', 'shadow-[0_0_12px_#00F0FF]')}
        />
      </div>

      {/* Side dot navigation (desktop only) */}
      <nav
        aria-label="Page sections"
        className={clsx(
          'hidden', 'lg:flex', 'fixed', 'right-4', 'top-1/2', '-translate-y-1/2', 'z-40',
          'flex-col', 'items-end', 'gap-3', 'transition-all', 'duration-500',
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        )}
      >
        {navItems.map((id) => {
          const isActive = active === id;
          const item = SECTIONS[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              aria-label={`Go to ${item.label}`}
              aria-current={isActive ? 'true' : undefined}
              className={clsx('group', 'relative', 'flex', 'items-center', 'justify-end', 'h-4', 'pl-24')}
            >
              <span
                className={clsx(
                  'absolute', 'right-6', 'whitespace-nowrap', 'font-mono', 'text-[9px]', 'uppercase',
                  'tracking-[0.25em]', 'transition-all', 'duration-300',
                  isActive
                    ? 'opacity-100 text-[#00F0FF]'
                    : 'opacity-0 -translate-x-1 text-white/70 group-hover:opacity-100 group-hover:translate-x-0'
                )}
              >
                {item.numbered ? `${sectionNumber(id)} ` : ''}
                {item.label}
              </span>
              <span
                className={clsx(
                  'block', 'rounded-full', 'transition-all', 'duration-300',
                  isActive
                    ? 'w-2.5 h-2.5 bg-[#0066FF] shadow-[0_0_12px_#0066FF]'
                    : 'w-1.5 h-1.5 bg-white/25 group-hover:bg-white group-hover:scale-150'
                )}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};

import React, { useEffect, useState, useRef } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor], button, a, input, select, textarea');
      if (interactiveEl) {
        setIsPointer(true);
        const customText = interactiveEl.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      } else {
        setIsPointer(false);
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const animateTrailing = () => {
      currentX += (position.x - currentX) * 0.2;
      currentY += (position.y - currentY) * 0.2;
      setTrailingPos({ x: currentX, y: currentY });
      requestRef.current = requestAnimationFrame(animateTrailing);
    };

    requestRef.current = requestAnimationFrame(animateTrailing);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [position.x, position.y]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Primary Dot (Exact Pointer) */}
      <div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-cine-gold rounded-full transition-transform duration-75 shadow-[0_0_8px_#FFB800]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 0 : 1})`
        }}
      />

      {/* Trailing Inertia Ring / Badge in Electric Gold */}
      <div
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center transition-all duration-150 ease-out border ${
          isHovered
            ? 'w-24 h-24 -ml-12 -mt-12 bg-gradient-to-r from-cine-orange to-cine-gold border-cine-gold text-black backdrop-blur-sm shadow-[0_0_35px_rgba(255,184,0,0.6)] scale-100'
            : isPointer
            ? 'w-12 h-12 -ml-6 -mt-6 border-cine-gold/70 bg-cine-gold/10 scale-110 shadow-[0_0_15px_rgba(255,184,0,0.3)]'
            : 'w-8 h-8 -ml-4 -mt-4 border-white/30 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`
        }}
      >
        {cursorText && (
          <span className="font-mono text-[10px] font-black tracking-widest uppercase text-black">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};

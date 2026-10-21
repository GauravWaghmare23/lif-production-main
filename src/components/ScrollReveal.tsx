import React, { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  className?: string;
  threshold?: number;
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * No GSAP dependency — purely CSS transitions triggered by data attributes.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-revealed', '');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const revealAttr = direction === 'up' ? '' : direction;

  return (
    <div
      ref={ref}
      data-reveal={revealAttr || ''}
      data-delay={delay > 0 ? String(delay) : undefined}
      className={className}
    >
      {children}
    </div>
  );
};

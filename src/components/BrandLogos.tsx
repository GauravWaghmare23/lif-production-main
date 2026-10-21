import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { CLIENTS_DATA as BRANDS } from '../data/brands';
import { section, eyebrow } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

export const BrandLogos: React.FC = () => {
  // Clients come from src/data/brands.json, labels from sections.json → "clients"
  const t = section('clients');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      timeScale: 0.15,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    if (!trackRef.current) return;

    gsap.to(trackRef.current, {
      timeScale: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  React.useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      /*
       * ----------------------------------------------------
       * 1. INFINITE AUTOMATIC MARQUEE
       * ----------------------------------------------------
       *
       * We render the brand list twice.
       * Moving -50% means the second copy takes the
       * exact position of the first copy.
       *
       * Because the two sets are identical, the loop
       * becomes visually seamless.
       */

      const marquee = gsap.to(track, {
        xPercent: -50,
        duration: 24,
        ease: 'none',
        repeat: -1,
        paused: false,
      });

      /*
       * ----------------------------------------------------
       * 2. SCROLL PARALLAX
       * ----------------------------------------------------
       *
       * Scrolling changes the marquee velocity.
       * This gives the horizontal movement a more
       * organic parallax feeling rather than just
       * being a normal CSS marquee.
       */

      let scrollVelocity = 0;

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',

        onUpdate: (self) => {
          scrollVelocity = self.getVelocity();

          /*
           * Convert vertical scroll velocity into
           * horizontal movement.
           */
          const direction = self.direction;

          const speed = gsap.utils.clamp(
            0.35,
            3,
            1 + Math.abs(scrollVelocity) / 1800
          );

          /*
           * Scroll down  -> normal direction
           * Scroll up    -> reverse direction
           */
          const targetSpeed =
            direction === 1 ? speed : -speed;

          gsap.to(marquee, {
            timeScale: targetSpeed,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: true,
          });

          /*
           * Slight skew while scrolling.
           * This creates the cinematic "velocity"
           * feeling.
           */
          gsap.to(track, {
            skewX: gsap.utils.clamp(
              -2.5,
              2.5,
              -scrollVelocity / 2500
            ),
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        },

        onLeave: () => {
          gsap.to(marquee, {
            timeScale: 1,
            duration: 0.8,
            ease: 'power3.out',
          });

          gsap.to(track, {
            skewX: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
        },

        onEnterBack: () => {
          gsap.to(marquee, {
            timeScale: 1,
            duration: 0.8,
            ease: 'power3.out',
          });
        },
      });

      /*
       * ----------------------------------------------------
       * 3. MOUSE MOVEMENT PARALLAX
       * ----------------------------------------------------
       *
       * Small horizontal movement based on cursor
       * position adds another subtle layer.
       */

      const handleMouseMove = (event: MouseEvent) => {
        const rect = section.getBoundingClientRect();

        const mouseX =
          (event.clientX - rect.left) / rect.width;

        const movement = (mouseX - 0.5) * 35;

        gsap.to(track, {
          x: movement,
          duration: 1.2,
          ease: 'power3.out',
          overwrite: false,
        });
      };

      section.addEventListener('mousemove', handleMouseMove);

      /*
       * ----------------------------------------------------
       * 4. INITIAL CARD REVEAL
       * ----------------------------------------------------
       */

      gsap.fromTo(
        section.querySelectorAll('.brand-card'),
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        }
      );

      return () => {
        section.removeEventListener(
          'mousemove',
          handleMouseMove
        );
      };
    }, section);

    return () => ctx.revert();
  }, []);

  /*
   * Render the brands twice.
   * This is what makes the marquee infinitely loop.
   */
  const renderBrands = (copy: number) =>
    BRANDS.map((brand, index) => (
      <div
        key={`${copy}-${index}`}
        className={clsx('brand-card', 'group', 'relative', 'shrink-0', 'w-[220px]', 'sm:w-[250px]', 'md:w-[280px]', 'lg:w-[300px]', 'h-[130px]', 'md:h-[150px]', 'border', 'border-white/10', 'bg-white/[0.025]', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'overflow-hidden', 'transition-colors', 'duration-500', 'hover:border-[#0066FF]/60', 'hover:bg-white/[0.045]')}
      >
        {/* Corner details */}

        <span
          className={clsx('absolute', 'top-0', 'left-0', 'w-5', 'h-px', 'bg-[#0066FF]', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')}
        />

        <span
          className={clsx('absolute', 'top-0', 'left-0', 'h-5', 'w-px', 'bg-[#0066FF]', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')}
        />

        <span
          className={clsx('absolute', 'bottom-0', 'right-0', 'w-5', 'h-px', 'bg-[#0066FF]', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')}
        />

        <span
          className={clsx('absolute', 'bottom-0', 'right-0', 'h-5', 'w-px', 'bg-[#0066FF]', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')}
        />

        {/* Index */}

        <span
          className={clsx('absolute', 'top-3', 'left-3', 'font-mono', 'text-[8px]', 'tracking-[0.25em]', 'text-white/20', 'transition-colors', 'duration-500', 'group-hover:text-[#0066FF]/70')}
        >
          [{String(index + 1).padStart(2, '0')}]
        </span>

        {/* Brand */}

        <span
          className={clsx('relative', 'z-10', 'font-sans', 'text-lg', 'md:text-xl', 'font-bold', 'tracking-[0.18em]', 'text-white/80', 'transition-all', 'duration-500', 'group-hover:text-white', 'group-hover:tracking-[0.24em]')}
        >
          {brand.name}
        </span>

        {/* Category */}

        <span
          className={clsx('mt-3', 'font-mono', 'text-[8px]', 'md:text-[9px]', 'tracking-[0.2em]', 'text-[#0066FF]/70', 'uppercase', 'transition-all', 'duration-500', 'group-hover:text-[#0066FF]')}
        >
          {brand.category}
        </span>

        {/* Hover line */}

        <span
          className={clsx('absolute', 'bottom-0', 'left-1/2', 'h-px', 'w-0', 'bg-[#0066FF]', '-translate-x-1/2', 'transition-all', 'duration-700', 'group-hover:w-[70%]')}
        />
      </div>
    ));

  return (
    <section
      ref={sectionRef}
      className={clsx('relative', 'py-16', 'md:py-24', 'bg-[#000000]', 'border-t', 'border-white/10', 'select-none', 'overflow-hidden')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------- */}

      <div
        className={clsx('max-w-[1440px]', 'mx-auto', 'px-6', 'md:px-12', 'mb-10', 'md:mb-14', 'flex', 'items-end', 'justify-between', 'gap-6')}
      >
        <div>
          <div
            className={clsx('flex', 'items-center', 'gap-3', 'font-mono', 'text-[9px]', 'md:text-[10px]', 'tracking-[0.3em]', 'text-white/40', 'uppercase')}
          >
            <span
              className={clsx('w-1.5', 'h-1.5', 'rounded-full', 'bg-[#0066FF]', 'shadow-[0_0_10px_rgba(0,102,255,0.8)]', 'animate-pulse')}
            />

            <span>{eyebrow('clients')}</span>
          </div>

          <h2
            className={clsx('mt-4', 'font-sans', 'text-4xl', 'sm:text-5xl', 'md:text-6xl', 'font-medium', 'tracking-tight', 'text-white', 'uppercase')}
          >
            {t.title}
          </h2>
        </div>

        <div
          className={clsx('hidden', 'md:block', 'font-mono', 'text-[9px]', 'tracking-[0.3em]', 'text-white/30', 'uppercase', 'text-right')}
        >
          <div>{t.rightTop}</div>
          <div className={clsx('mt-2', 'text-[#0066FF]/60')}>
            {t.rightBottom}
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* MARQUEE */}
      {/* --------------------------------------------- */}

      <div
        className={clsx('relative', 'w-full', 'overflow-hidden', 'py-4')}
      >
        {/* Left fade */}

        <div
          className={clsx('pointer-events-none', 'absolute', 'left-0', 'top-0', 'bottom-0', 'w-20', 'md:w-40', 'z-20', 'bg-gradient-to-r', 'from-black', 'to-transparent')}
        />

        {/* Right fade */}

        <div
          className={clsx('pointer-events-none', 'absolute', 'right-0', 'top-0', 'bottom-0', 'w-20', 'md:w-40', 'z-20', 'bg-gradient-to-l', 'from-black', 'to-transparent')}
        />

        {/* Moving track */}

        <div
          ref={trackRef}
          className={clsx('flex', 'w-max', 'gap-4', 'md:gap-6', 'will-change-transform')}
        >
          {/* First copy */}

          <div className={clsx('flex', 'gap-4', 'md:gap-6')}>
            {renderBrands(0)}
          </div>

          {/* Second copy */}

          <div
            className={clsx('flex', 'gap-4', 'md:gap-6')}
            aria-hidden="true"
          >
            {renderBrands(1)}
          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BOTTOM META */}
      {/* --------------------------------------------- */}

      <div
        className={clsx('max-w-[1440px]', 'mx-auto', 'px-6', 'md:px-12', 'mt-8', 'md:mt-10', 'flex', 'items-center', 'justify-between', 'font-mono', 'text-[8px]', 'md:text-[9px]', 'tracking-[0.25em]', 'text-white/25', 'uppercase')}
      >
        <span>{t.bottomLeft}</span>

        <span className={clsx('hidden', 'sm:block')}>
          {t.bottomMid}
        </span>

        <span className="text-[#0066FF]/60">
          {t.bottomRight}
        </span>
      </div>
    </section>
  );
};
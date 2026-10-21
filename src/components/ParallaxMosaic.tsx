import React, { useEffect, useRef, useState } from 'react';

import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/projects';
import { soundEngine } from '../utils/audioSynth';

import { ArrowDown, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

import { HorizontalScrollCards } from './HorizontalScrollCards';
import { MOSAIC_VIDEOS } from '../data/videos';
import { section, eyebrow } from '../data/site';

interface ParallaxMosaicProps {
  onSelectProject: (project: Project) => void;
}

interface MosaicCardProps {
  project: Project;
  className: string;
  style?: React.CSSProperties;
  index: number;
  label?: string;
  tall?: boolean;
  onClick: () => void;
}

/* =========================================================
   REUSABLE PROJECT CARD
========================================================= */

const MosaicCard: React.FC<MosaicCardProps> = ({
  project,
  className,
  style,
  index,
  label,
  tall = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);

    soundEngine.playLensTick(1.05);

    if (videoRef.current && project.heroVideo) {
      videoRef.current.currentTime = 0;

      videoRef.current
        .play()
        .catch(() => {
          // Browser may block playback.
        });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'absolute',
        'overflow-hidden',
        'border',
        'bg-black',
        'cursor-pointer',
        'group',
        'shadow-2xl',
        'will-change-transform',
        'transition-all',
        'duration-500',
        'ease-out',
        hovered
          ? 'border-[#0066FF] shadow-[0_30px_100px_rgba(0,102,255,0.2)]'
          : 'border-white/20',
        className,
      )}
      style={style}
    >
      {/* =====================================================
          IMAGE / VIDEO
      ===================================================== */}

      <div className={clsx('absolute', 'inset-0', 'overflow-hidden')}>
        <img
          src={project.heroImage}
          alt={project.title}
          className={clsx(
            'absolute',
            'inset-0',
            'w-full',
            'h-full',
            'object-cover',
            'transition-all',
            'duration-1000',
            'ease-out',
            hovered
              ? 'scale-[1.08] brightness-105'
              : 'scale-100 brightness-[0.78]',
          )}
        />

        {project.heroVideo && (
          <video
            ref={videoRef}
            src={project.heroVideo}
            muted
            loop
            playsInline
            className={clsx(
              'absolute',
              'inset-0',
              'w-full',
              'h-full',
              'object-cover',
              'transition-opacity',
              'duration-700',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}

        {/* Cinematic grade */}
        <div
          className={clsx(
            'absolute',
            'inset-0',
            'bg-gradient-to-t',
            'from-black',
            'via-black/20',
            'to-black/20',
            'transition-opacity',
            'duration-700',
            hovered ? 'opacity-80' : 'opacity-100',
          )}
        />

        {/* Blue cinematic glow */}
        <div
          className={clsx(
            'absolute',
            'inset-0',
            'bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.2),transparent_65%)]',
            'transition-opacity',
            'duration-700',
            hovered ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>

      {/* =====================================================
          TOP META
      ===================================================== */}

      <div className={clsx('absolute', 'top-3', 'left-3', 'right-3', 'z-10', 'flex', 'items-center', 'justify-between')}>
        <span className={clsx('font-mono', 'text-[9px]', 'tracking-widest', 'text-white/70', 'bg-black/70', 'backdrop-blur-md', 'border', 'border-white/10', 'px-2', 'py-1')}>
          [ 0{index + 1} ]
        </span>

        {label && (
          <span className={clsx('font-mono', 'text-[8px]', 'tracking-widest', 'uppercase', 'text-[#0066FF]', 'bg-black/70', 'backdrop-blur-md', 'border', 'border-[#0066FF]/30', 'px-2', 'py-1')}>
            {label}
          </span>
        )}
      </div>

      {/* =====================================================
          PROJECT INFORMATION
      ===================================================== */}

      <div
        className={clsx(
          'absolute',
          'bottom-0',
          'left-0',
          'right-0',
          'z-10',
          'p-4',
          tall ? 'md:p-6' : 'md:p-5',
        )}
      >
        <div
          className={clsx(
            'transform transition-all duration-500',
            hovered ? 'translate-y-0' : 'translate-y-1',
          )}
        >
          <span className={clsx('block', 'font-mono', 'text-[9px]', 'text-[#0066FF]', 'uppercase', 'tracking-widest', 'mb-1')}>
            {project.category}
          </span>

          <h3
            className={clsx(
              'font-sans',
              'font-medium',
              'text-white',
              'tracking-tight',
              'leading-tight',
              tall
                ? 'text-2xl md:text-3xl'
                : 'text-xl md:text-2xl',
            )}
          >
            {project.title}
          </h3>

          <div
            className={clsx(
              'overflow-hidden transition-all duration-500',
              hovered
                ? 'max-h-20 opacity-100 mt-2'
                : 'max-h-0 opacity-0',
            )}
          >
            <p className={clsx('font-mono', 'text-[9px]', 'text-white/60', 'uppercase', 'tracking-wide', 'line-clamp-2')}>
              {project.client}
              {project.director
                ? ` // ${project.director}`
                : ''}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          VIEW BUTTON
      ===================================================== */}

      <div
        className={clsx(
          'absolute',
          'inset-0',
          'z-20',
          'flex',
          'items-center',
          'justify-center',
          'pointer-events-none',
          'transition-all',
          'duration-500',
          hovered
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90',
        )}
      >
        <div className={clsx('flex', 'items-center', 'gap-2', 'px-4', 'py-2.5', 'bg-black/80', 'backdrop-blur-xl', 'border', 'border-[#0066FF]', 'text-white', 'font-mono', 'text-[10px]', 'tracking-widest', 'uppercase', 'shadow-[0_0_40px_rgba(0,102,255,0.25)]')}>
          <span>{section('archive').viewProject}</span>

          <ArrowUpRight className={clsx('w-3.5', 'h-3.5', 'text-[#0066FF]')} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PARALLAX MOSAIC
========================================================= */

export const ParallaxMosaic: React.FC<ParallaxMosaicProps> = ({
  onSelectProject,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [sectionProgress, setSectionProgress] = useState(0);
  const [framesProgress, setFramesProgress] = useState(0);

  /* ---------------------------------------------------------
     SCROLL PROGRESS
  --------------------------------------------------------- */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const wh = window.innerHeight;

        /* Section progress */
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();

          const progress = Math.min(
            Math.max(
              (wh - rect.top) /
              (wh + rect.height),
              0,
            ),
            1,
          );

          setSectionProgress(progress);
        }

        /* 4-frame progress */
        if (framesRef.current) {
          const rect = framesRef.current.getBoundingClientRect();

          const progress = Math.min(
            Math.max(
              (wh - rect.top) /
              (wh + rect.height),
              0,
            ),
            1,
          );

          setFramesProgress(progress);
        }

        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  }, []);

  /* ---------------------------------------------------------
     PARALLAX VALUES
  --------------------------------------------------------- */

  const centerProgress =
    sectionProgress - 0.5;

  const card1Y =
    centerProgress * -130;

  const card2Y =
    centerProgress * 120;

  const card3Y =
    centerProgress * -90;

  const card4Y =
    centerProgress * 150;

  /* ---------------------------------------------------------
     ZIG ZAG FRAME ANIMATION
  --------------------------------------------------------- */

  const maxOffset = 300;

  const frameOffset = Math.max(
    0,
    (0.5 - framesProgress) * 2 * maxOffset,
  );

  const textOpacity = Math.min(
    1,
    Math.max(
      0,
      (framesProgress - 0.48) * 10,
    ),
  );

  /* ---------------------------------------------------------
     PROJECT DATA
     
     IMPORTANT:
     Every visual card uses PROJECTS_DATA.
     No hardcoded project names/images.
  --------------------------------------------------------- */

  const projects = PROJECTS_DATA.slice(
    0,
    4,
  );

  /*
   * If you have fewer than 4 projects,
   * don't crash the layout.
   */
  if (projects.length === 0) {
    return null;
  }

  const project1 = projects[0];
  const project2 =
    projects[1] || projects[0];
  const project3 =
    projects[2] || projects[0];
  const project4 =
    projects[3] || projects[0];

  return (
    <section
      ref={sectionRef}
      className={clsx(
        'relative',
        'bg-[#000000]',
        'border-t',
        'border-white/10',
        'py-20',
        'select-none',
        'overflow-hidden',
      )}
    >
      <div
        className={clsx(
          'max-w-[1440px]',
          'mx-auto',
          'px-6',
          'md:px-12',
          'relative',
          'z-10',
        )}
      >
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className={clsx('flex', 'items-center', 'justify-between', 'border-b', 'border-white/10', 'pb-4', 'mb-16')}>
          <div className={clsx('flex', 'items-center', 'gap-3')}>
            <span className={clsx('w-1.5', 'h-1.5', 'rounded-full', 'bg-[#0066FF]', 'shadow-[0_0_12px_rgba(0,102,255,0.8)]')} />

            <span className={clsx('font-mono', 'text-[10px]', 'md:text-xs', 'text-white/50', 'tracking-widest', 'uppercase')}>
              {eyebrow('archive')}
            </span>
          </div>

          <span className={clsx('hidden', 'sm:block', 'font-mono', 'text-[10px]', 'text-white/40', 'tracking-widest', 'uppercase')}>
            {section('archive').eyebrowRight}
          </span>
        </div>

        {/* =====================================================
            FLOATING PYRAMID / ZIG-ZAG MOSAIC
        ===================================================== */}

        <div className={clsx('relative', 'min-h-[820px]', 'md:min-h-[900px]', 'w-full', 'mb-24')}>
          {/* -----------------------------------------------
              CARD 1 — LEFT
          ------------------------------------------------ */}

          <MosaicCard
            project={project1}
            index={0}
            label="DIRECTED"
            onClick={() => {
              soundEngine.playShutter();
              onSelectProject(project1);
            }}
            style={{
              transform: `translate3d(0, ${card2Y}px, 0)`,
            }}
            className={clsx(
              'left-0',
              'top-[25%]',
              'w-[82%]',
              'sm:w-[39%]',
              'md:w-[29%]',
              'aspect-[3/4]',
              'z-20',
            )}
          />

          {/* -----------------------------------------------
              CARD 2 — CENTER TALL
          ------------------------------------------------ */}

          <MosaicCard
            project={project2}
            index={1}
            label="HERO FRAME"
            tall
            onClick={() => {
              soundEngine.playShutter();
              onSelectProject(project2);
            }}
            style={{
              transform: `translate3d(0, ${card1Y}px, 0)`,
            }}
            className={clsx(
              'left-[9%]',
              'sm:left-[34%]',
              'md:left-[36%]',
              'top-0',
              'w-[82%]',
              'sm:w-[34%]',
              'md:w-[27%]',
              'aspect-[9/17]',
              'z-30',
              'border-[#0066FF]/30',
            )}
          />

          {/* -----------------------------------------------
              CARD 3 — RIGHT TOP
          ------------------------------------------------ */}

          <MosaicCard
            project={project3}
            index={2}
            label="CINEMA"
            onClick={() => {
              soundEngine.playShutter();
              onSelectProject(project3);
            }}
            style={{
              transform: `translate3d(0, ${card4Y}px, 0)`,
            }}
            className={clsx(
              'right-0',
              'top-[2%]',
              'w-[72%]',
              'sm:w-[34%]',
              'md:w-[27%]',
              'aspect-[4/3]',
              'hidden',
              'sm:block',
              'z-10',
            )}
          />

          {/* -----------------------------------------------
              CARD 4 — RIGHT BOTTOM
          ------------------------------------------------ */}

          <MosaicCard
            project={project4}
            index={3}
            label="CAMPAIGN"
            onClick={() => {
              soundEngine.playShutter();
              onSelectProject(project4);
            }}
            style={{
              transform: `translate3d(0, ${card3Y}px, 0)`,
            }}
            className={clsx(
              'right-0',
              'top-[40%]',
              'w-[82%]',
              'sm:w-[39%]',
              'md:w-[29%]',
              'aspect-[3/4]',
              'z-20',
            )}
          />
        </div>

        {/* =====================================================
            HORIZONTAL PROJECT SCROLL
        ===================================================== */}

        <div className={clsx('-mx-6', 'md:-mx-12', 'mb-32')}>
          <HorizontalScrollCards
            onSelectProject={onSelectProject}
          />
        </div>

        {/* =====================================================
            3 PANEL SLICED VIDEO
        ===================================================== */}

        {/* <div className={clsx('p-5', 'md:p-8', 'bg-[#050505]', 'border', 'border-white/10', 'shadow-2xl')}>
          <div className={clsx('flex', 'items-center', 'justify-between', 'gap-4', 'border-b', 'border-white/10', 'pb-4', 'mb-6')}>
            <span className={clsx('font-mono', 'text-[10px]', 'md:text-xs', 'text-[#0066FF]', 'tracking-widest', 'uppercase', 'font-bold')}>
              MOTION STUDY // 3 FRAME ASSEMBLY
            </span>

            <span className={clsx('hidden', 'sm:block', 'font-mono', 'text-[10px]', 'text-white/40', 'tracking-widest')}>
              DIRECTORIAL CUT
            </span>
          </div>

          <div className={clsx('relative', 'w-full', 'aspect-video', 'sm:aspect-[21/9]', 'overflow-hidden', 'bg-[#080808]', 'flex')}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx('flex-1', 'overflow-hidden', 'relative')}
              >
                {project2.heroVideo ? (
                  <video
                    src={project2.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={clsx('absolute', 'inset-0', 'w-[300%]', 'h-full', 'max-w-none', 'object-cover', 'contrast-125', 'brightness-90')}
                    style={{
                      left: `${-i * 100}%`,
                    }}
                  />
                ) : (
                  <img
                    src={project2.heroImage}
                    alt={project2.title}
                    className={clsx('absolute', 'inset-0', 'w-[300%]', 'h-full', 'max-w-none', 'object-cover', 'contrast-125', 'brightness-90')}
                    style={{
                      left: `${-i * 100}%`,
                    }}
                  />
                )}

                <div className={clsx('absolute', 'inset-0', 'bg-black/20', 'pointer-events-none')} />
              </div>
            ))}
          </div>

          <div className={clsx('mt-4', 'flex', 'items-center', 'justify-between')}>
            <span className={clsx('font-mono', 'text-[9px]', 'text-white/40', 'uppercase', 'tracking-widest')}>
              {project2.title}
            </span>

            <span className={clsx('font-mono', 'text-[9px]', 'text-[#0066FF]', 'uppercase', 'tracking-widest')}>
              {project2.category}
            </span>
          </div>
        </div> */}

        {/* =====================================================
            4 FRAME ZIG-ZAG
        ===================================================== */}

        <div ref={framesRef} className={clsx('mt-24', 'relative', 'overflow-hidden')}>
          {/* Outer wrapper — padding so the zig-zag frames have room */}
          <div className={clsx('px-0', 'py-8', 'relative')} style={{ minHeight: '440px' }}>
            <div className={clsx('grid', 'grid-cols-4', 'gap-3', 'md:gap-5', 'w-full', 'h-[500px]')}>
              {[0, 1, 2, 3].map((frameIdx) => {
                // Zig-zag: even frames come from ABOVE (negative), odd from BELOW (positive)
                const yStart = frameIdx % 2 === 0 ? -frameOffset : frameOffset;
                return (
                  <div
                    key={frameIdx}
                    className={clsx('relative', 'overflow-hidden', 'border', 'border-white/20', 'bg-black', 'will-change-transform')}
                    style={{
                      transform: `translate3d(0, ${yStart}px, 0)`,
                      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <video
                      ref={(el) => {
                        if (el) {
                          videoRefs.current[frameIdx] = el;
                        }
                      }}
                      muted
                      playsInline
                      preload="auto"
                      className={clsx(
                        'absolute',
                        'inset-0',
                        'w-[400%]',
                        'h-full',
                        'object-cover',
                        'filter',
                        'grayscale',
                        'contrast-125',
                        'brightness-90',
                        'max-w-none'
                      )}
                      style={{
                        left: `-${frameIdx * 100}%`,
                      }}
                    >
                      <source src={MOSAIC_VIDEOS.heroLocal} type="video/mp4" />
                      <source
                        src={MOSAIC_VIDEOS.hero}
                        type="video/mp4"
                      />
                    </video>
                    <div className={clsx('absolute', 'inset-0', 'bg-black/30', 'pointer-events-none')} />
                  </div>
                );
              })}
            </div>

            {/* "create with us." fades in once frames are aligned */}
            <div
              className={clsx('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'pointer-events-none')}
              style={{
                opacity: textOpacity,
                transform: `scale(${0.9 + textOpacity * 0.1})`,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <h2
                className={clsx('font-sans', 'font-bold', 'text-white', 'tracking-tight', 'leading-none', 'drop-shadow-[0_20px_60px_rgba(0,0,0,0.98)]', 'uppercase', 'text-center')}
                style={{ fontSize: 'clamp(3rem, 10vw, 9.5rem)' }}
              >
                {section('archive').closingLine}<span className="text-[#0066FF]">.</span>
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* =====================================================
          KEEP MOVING
      ===================================================== */}

      <div className={clsx('fixed', 'bottom-6', 'right-6', 'z-40')}>
        <button
          onClick={() => {
            soundEngine.playLensTick(1);

            window.scrollBy({
              top: window.innerHeight * 0.8,
              behavior: 'smooth',
            });
          }}
          className={clsx(
            'px-4',
            'py-2',
            'bg-black/90',
            'backdrop-blur-md',
            'border',
            'border-white/20',
            'hover:border-[#0066FF]',
            'text-white',
            'font-mono',
            'text-xs',
            'tracking-wider',
            'uppercase',
            'flex',
            'items-center',
            'space-x-2',
            'shadow-2xl',
            'transition-all',
            'duration-300',
            'hover:scale-105',
          )}
        >
          <span>{section('archive').keepMoving}</span>

          <ArrowDown className={clsx('w-3.5', 'h-3.5', 'text-[#0066FF]', 'animate-bounce')} />
        </button>
      </div>
    </section>
  );
};

export default ParallaxMosaic;
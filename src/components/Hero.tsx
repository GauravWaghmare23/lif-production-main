import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, ArrowDownRight } from 'lucide-react';
import { gsap } from 'gsap';
import { soundEngine } from '../utils/audioSynth';
import clsx from 'clsx';
import { HERO_VIDEOS } from '../data/videos';
import { section } from '../data/site';

interface HeroProps {
  onWatchShowreel: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onWatchShowreel,
  onExploreWork,
}) => {
  // All copy comes from src/data/sections.json → "hero"
  const t = section('hero');

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timecode, setTimecode] = useState('00:00');

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subHeadlineRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  /*
   * ------------------------------------------------------------
   * VIDEO TIME / PROGRESS
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      const pct = (video.currentTime / video.duration) * 100;

      setProgress(pct);

      const mins = Math.floor(video.currentTime / 60);
      const secs = Math.floor(video.currentTime % 60);

      setTimecode(
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * GSAP HERO INTRO ANIMATION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headlineWords = headlineRef.current?.querySelectorAll(
        '.hero-word'
      );

      const headlineLines = headlineRef.current?.querySelectorAll(
        '.hero-line'
      );

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power4.out',
        },
      });

      /*
       * Initial state
       */

      gsap.set(eyebrowRef.current, {
        opacity: 0,
        y: -20,
      });

      gsap.set(headlineWords, {
        opacity: 0,
        y: 100,
        rotateX: -45,
        transformOrigin: '50% 100%',
      });

      gsap.set(subHeadlineRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(exploreRef.current, {
        opacity: 0,
        y: 25,
      });

      gsap.set(bottomBarRef.current, {
        opacity: 0,
        y: 20,
      });

      gsap.set(metaRef.current, {
        opacity: 0,
      });

      /*
       * Cinematic entrance
       */

      timeline
        .to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        })
        .to(
          headlineWords,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.15,
            stagger: 0.075,
            ease: 'power4.out',
          },
          '-=0.35'
        )
        .to(
          subHeadlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.65'
        )
        .to(
          exploreRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .to(
          bottomBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.35'
        )
        .to(
          metaRef.current,
          {
            opacity: 1,
            duration: 0.7,
          },
          '-=0.5'
        );

      /*
       * Subtle continuous video scale
       */

      gsap.fromTo(
        videoRef.current,
        {
          scale: 1.08,
        },
        {
          scale: 1,
          duration: 3.5,
          ease: 'power2.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
   * ------------------------------------------------------------
   * PLAY / PAUSE
   * ------------------------------------------------------------
   */

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    soundEngine.playLensTick(1.0);
  };

  /*
   * ------------------------------------------------------------
   * SCRUBBER
   * ------------------------------------------------------------
   */

  const handleTrackClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const pos = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1
    );

    video.currentTime = pos * video.duration;

    soundEngine.playLensTick(1.2);
  };

  /*
   * ------------------------------------------------------------
   * SCROLL TO WORK
   * ------------------------------------------------------------
   */

  const handleExplore = () => {
    soundEngine.playLensTick(1.1);
    onExploreWork();
  };

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <section
      ref={sectionRef}
      className={clsx('relative', 'w-full', 'h-screen', 'min-h-[750px]', 'flex', 'flex-col', 'justify-between', 'overflow-hidden', 'bg-black', 'select-none', 'p-6', 'md:p-12', 'pt-28')}
    >
      {/* ======================================================
          BACKGROUND VIDEO
      ====================================================== */}

      <div className={clsx('absolute', 'inset-0', 'z-0', 'overflow-hidden')}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={clsx('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'opacity-65', 'filter', 'brightness-200', 'contrast-110', 'saturate-[0.9]', 'will-change-transform')}
        >
          <source
            src={HERO_VIDEOS.mainBg}
            type="video/mp4"
          />

          <source
            src={HERO_VIDEOS.fallbackBg}
            type="video/mp4"
          />
        </video>

        {/* Cinematic dark gradient */}

        <div
          className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black', 'via-black/25', 'to-black/45', 'pointer-events-none')}
        />

        {/* Left cinematic vignette */}

        <div
          className={clsx('absolute', 'inset-0', 'bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]', 'pointer-events-none')}
        />

        {/* Subtle blue cinematic glow */}

        <div
          className={clsx('absolute', '-right-40', 'top-1/3', 'w-[500px]', 'h-[500px]', 'rounded-full', 'bg-[#0066FF]/10', 'blur-[140px]', 'pointer-events-none')}
        />
      </div>

      {/* ======================================================
          TOP META
      ====================================================== */}

      {/* <div
        ref={metaRef}
        className={clsx('absolute', 'top-6', 'left-6', 'right-6', 'md:left-12', 'md:right-12', 'z-20', 'flex', 'items-center', 'justify-between', 'font-mono', 'text-[9px]', 'md:text-[10px]', 'tracking-[0.22em]', 'uppercase', 'text-white/60')}
      >
        <div className={clsx('flex', 'items-center', 'gap-3')}>
          <span
            className={clsx('relative', 'flex', 'items-center', 'justify-center', 'w-2', 'h-2')}
          >
            <span
              className={clsx('absolute', 'inset-0', 'rounded-full', 'bg-[#0066FF]', 'animate-ping', 'opacity-60')}
            />

            <span
              className={clsx('relative', 'w-1.5', 'h-1.5', 'rounded-full', 'bg-[#0066FF]', 'shadow-[0_0_15px_#0066FF]')}
            />
          </span>

          <span className="text-white/80">
            00 // LOST IN FRAME
          </span>
        </div>

        <div className={clsx('hidden', 'md:block')}>
          DIRECTOR LED CINEMA / 2026
        </div>
      </div> */}

      {/* ======================================================
          MAIN HERO CONTENT
      ====================================================== */}

      <div
        ref={heroContentRef}
        className={clsx('relative', 'z-10', 'my-auto', 'w-full', 'max-w-[1400px]', 'mx-auto', 'flex', 'flex-col', 'justify-center')}
      >
        {/* Small cinematic eyebrow */}

        <div
          ref={eyebrowRef}
          className={clsx('mb-7', 'flex', 'items-center', 'gap-4', 'font-mono', 'text-[10px]', 'md:text-xs', 'tracking-[0.28em]', 'uppercase', 'text-white/55')}
        >
          {/* <span className="text-[#0066FF]">
            01
          </span>

          <span className={clsx('w-12', 'h-px', 'bg-[#0066FF]/70')} />

          <span>
            DIRECTOR LED CINEMATIC PRODUCTION
          </span> */}
        </div>

        {/* ==================================================
            MAIN DYNAMIC TYPOGRAPHY
        ================================================== */}

        <h1
          ref={headlineRef}
          className={clsx('relative', 'max-w-[1250px]', 'font-sans', 'text-white', 'tracking-[-0.055em]', 'leading-[0.88]', 'font-medium', 'perspective-[1000px]')}
          style={{
            fontSize: 'clamp(3.5rem, 9.5vw, 9.5rem)',
          }}
        >
          {t.headline.map(
            (line: { text: string; style: string }[], lineIdx: number) => (
              <span
                key={lineIdx}
                className={clsx(
                  'hero-line',
                  'block',
                  'overflow-hidden',
                  lineIdx === t.headline.length - 1 ? 'pb-4' : 'pb-2'
                )}
              >
                {line.map((word, wordIdx) => (
                  <React.Fragment key={wordIdx}>
                    <span
                      className={clsx(
                        'hero-word',
                        'inline-block',
                        'will-change-transform',
                        word.style === 'dim' && 'text-white/80',
                        word.style === 'accent' && [
                          'bg-gradient-to-r',
                          'from-[#0066FF]',
                          'via-[#38BDF8]',
                          'to-[#00F0FF]',
                          'bg-clip-text',
                          'text-transparent',
                          'drop-shadow-[0_0_45px_rgba(0,240,255,0.3)]',
                        ]
                      )}
                    >
                      {word.text}
                    </span>
                    {wordIdx < line.length - 1 ? ' ' : null}
                  </React.Fragment>
                ))}
              </span>
            )
          )}
        </h1>

        {/* ==================================================
            SUB HEADLINE
        ================================================== */}

        <div
          ref={subHeadlineRef}
          className={clsx('mt-8', 'md:mt-10', 'flex', 'items-start', 'md:items-center', 'gap-3', 'max-w-3xl', 'text-white/80')}
        >
          <span
            className={clsx('text-[#38BDF8]', 'font-mono', 'text-lg', 'md:text-xl', 'leading-none', 'pt-1')}
          >
            [
          </span>

          <p
            className={clsx('font-sans', 'text-sm', 'md:text-lg', 'lg:text-xl', 'font-normal', 'leading-relaxed', 'tracking-[-0.01em]', 'text-white/80')}
          >
            {t.subheadline[0]}
            <span className={clsx('text-white/30', 'mx-2')}>
              {t.subheadlineJoiner}
            </span>
            {t.subheadline[1]}
          </p>

          <span
            className={clsx('text-[#38BDF8]', 'font-mono', 'text-lg', 'md:text-xl', 'leading-none')}
          >
            ]
          </span>
        </div>

        {/* ==================================================
            EXPLORE BUTTON
        ================================================== */}

        <button
          ref={exploreRef}
          onClick={handleExplore}
          className={clsx('mt-10', 'inline-flex', 'w-fit', 'items-center', 'gap-4', 'group', 'cursor-pointer', 'text-white', 'hover:text-[#00F0FF]', 'transition-colors')}
        >
          <span
            className={clsx('font-sans', 'text-sm', 'md:text-base', 'font-medium', 'tracking-wide')}
          >
            {t.exploreLabel}
          </span>

          <span
            className={clsx('relative', 'w-10', 'h-10', 'rounded-full', 'border', 'border-white/25', 'group-hover:border-[#00F0FF]', 'flex', 'items-center', 'justify-center', 'overflow-hidden', 'transition-all', 'duration-500', 'group-hover:translate-x-1', 'group-hover:translate-y-1')}
          >
            <ArrowDownRight
              className={clsx('relative', 'z-10', 'w-4', 'h-4', 'text-white', 'group-hover:text-[#00F0FF]', 'transition-colors')}
            />

            <span
              className={clsx('absolute', 'inset-0', 'rounded-full', 'bg-[#0052FF]/20', 'scale-0', 'group-hover:scale-100', 'transition-transform', 'duration-500')}
            />
          </span>
        </button>
      </div>

      {/* ======================================================
          BOTTOM VIDEO CONTROL BAR
      ====================================================== */}

      <div
        ref={bottomBarRef}
        className={clsx('relative', 'z-20', 'border-t', 'border-white/10', 'pt-4', 'flex', 'items-center', 'justify-between', 'gap-6', 'font-mono', 'text-xs', 'text-white/70')}
      >
        {/* Play / Pause / Timecode */}

        <div className={clsx('flex', 'items-center', 'space-x-4', 'shrink-0')}>
          <button
            onClick={togglePlay}
            aria-label={
              isPlaying
                ? 'Pause video'
                : 'Play video'
            }
            className={clsx('flex', 'items-center', 'justify-center', 'text-white', 'hover:text-[#00F0FF]', 'transition-colors')}
          >
            {isPlaying ? (
              <Pause
                className={clsx('w-3.5', 'h-3.5', 'fill-[#00F0FF]', 'text-[#00F0FF]')}
              />
            ) : (
              <Play
                className={clsx('w-3.5', 'h-3.5', 'fill-[#00F0FF]', 'text-[#00F0FF]')}
              />
            )}
          </button>

          <span className={clsx('font-mono', 'text-xs', 'text-white/90', 'tabular-nums')}>
            {timecode}
          </span>
        </div>

        {/* Progress Track */}

        <div
          onClick={handleTrackClick}
          role="slider"
          aria-label="Video progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className={clsx('flex-1', 'max-w-xl', 'h-1', 'bg-white/20', 'rounded-full', 'overflow-hidden', 'cursor-pointer', 'relative', 'group')}
        >
          <div
            className={clsx('h-full', 'bg-gradient-to-r', 'from-[#0052FF]', 'via-[#0EA5E9]', 'to-[#00F0FF]', 'transition-[width]', 'duration-150', 'relative')}
            style={{
              width: `${progress}%`,
            }}
          >
            <span
              className={clsx('absolute', 'right-0', 'top-1/2', '-translate-y-1/2', 'w-2', 'h-2', 'rounded-full', 'bg-white', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'shadow-[0_0_10px_#00F0FF]')}
            />
          </div>
        </div>

        {/* Scroll Tag */}

        <div
          className={clsx('hidden', 'sm:flex', 'items-center', 'gap-2', 'text-white/40', 'text-[10px]', 'tracking-[0.15em]', 'shrink-0')}
        >
          <span>
            {t.scrollTag}
          </span>

          <span className="text-[#0066FF]">
            ↓
          </span>
        </div>
      </div>

      {/* ======================================================
          SIDE DECORATION
      ====================================================== */}

      <div
        className={clsx('absolute', 'right-5', 'md:right-10', 'top-1/2', '-translate-y-1/2', 'z-10', 'hidden', 'xl:flex', 'flex-col', 'items-center', 'gap-5', 'pointer-events-none')}
      >
        <span
          className={clsx('h-20', 'w-px', 'bg-gradient-to-b', 'from-transparent', 'via-white/30', 'to-transparent')}
        />

        <span
          className={clsx('font-mono', 'text-[8px]', 'tracking-[0.35em]', 'text-white/30', '[writing-mode:vertical-rl]', 'rotate-180')}
        >
          {t.sideLabel}
        </span>

        <span
          className={clsx('h-20', 'w-px', 'bg-gradient-to-b', 'from-transparent', 'via-[#0066FF]/50', 'to-transparent')}
        />
      </div>
    </section>
  );
};
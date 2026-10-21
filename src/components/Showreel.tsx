import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';

import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  ArrowUpRight,
} from 'lucide-react';

import { soundEngine } from '../utils/audioSynth';
import { SHOWREEL_VIDEOS } from '../data/videos';
import { section, eyebrow } from '../data/site';

export const Showreel: React.FC = () => {
  // All copy comes from src/data/sections.json → "showreel"
  const t = section('showreel');
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  /*
   * IMPORTANT:
   * Keep this as a normal URL.
   * Do NOT put markdown [text](url) syntax inside the string.
   */
  const videoUrl = SHOWREEL_VIDEOS.main;

  /*
   * ---------------------------------------------------------
   * FORMAT TIME
   * ---------------------------------------------------------
   */
  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '00:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  /*
   * ---------------------------------------------------------
   * SMOOTH VIDEO PROGRESS
   * ---------------------------------------------------------
   */

  const updateProgress = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    const current = video.currentTime || 0;
    const total = video.duration || 0;

    setCurrentTime(current);

    if (total > 0) {
      setProgress((current / total) * 100);
    }

    if (!video.paused) {
      animationFrameRef.current =
        requestAnimationFrame(updateProgress);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * PLAY / PAUSE
   * ---------------------------------------------------------
   */

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();

        setIsPlaying(true);
        soundEngine.playShutter();

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current =
          requestAnimationFrame(updateProgress);
      } else {
        video.pause();

        setIsPlaying(false);
        soundEngine.playLensTick(0.9);

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    } catch (error) {
      console.error('Video playback failed:', error);
    }
  };

  /*
   * ---------------------------------------------------------
   * MUTE
   * ---------------------------------------------------------
   */

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    const muted = !video.muted;

    video.muted = muted;

    setIsMuted(muted);

    soundEngine.playLensTick(1.3);
  };

  /*
   * ---------------------------------------------------------
   * SEEK
   * ---------------------------------------------------------
   */

  const handleSeek = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const video = videoRef.current;

    if (!video || !video.duration) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const position =
      (event.clientX - rect.left) / rect.width;

    const clamped = Math.min(
      Math.max(position, 0),
      1
    );

    video.currentTime =
      clamped * video.duration;

    setProgress(clamped * 100);

    soundEngine.playLensTick(1.5);
  };

  /*
   * ---------------------------------------------------------
   * FULLSCREEN
   * ---------------------------------------------------------
   */

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();

        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();

        setIsFullscreen(false);
      }

      soundEngine.playLensTick(1.2);
    } catch (error) {
      console.error(
        'Fullscreen error:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * FULLSCREEN CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ===
          containerRef.current
      );
    };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * VIDEO METADATA
   * ---------------------------------------------------------
   */

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(video.duration);
  };

  /*
   * ---------------------------------------------------------
   * VIDEO EVENTS
   * ---------------------------------------------------------
   */

  const handlePlay = () => {
    setIsPlaying(true);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current =
      requestAnimationFrame(updateProgress);
  };

  const handlePause = () => {
    setIsPlaying(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  /*
   * ---------------------------------------------------------
   * SECTION REVEAL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          threshold: 0.15,
        }
      );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /*
   * ---------------------------------------------------------
   * CLEANUP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * HIDE CONTROLS AFTER PLAYING
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isPlaying || isHovering) {
      setShowControls(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowControls(false);
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isPlaying, isHovering]);

  /*
   * ---------------------------------------------------------
   * JSX
   * ---------------------------------------------------------
   */

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className={clsx('relative', 'bg-[#050505]', 'text-white', 'border-t', 'border-white/[0.08]', 'overflow-hidden')}
    >
      {/* ------------------------------------------------ */}
      {/* BACKGROUND ATMOSPHERE */}
      {/* ------------------------------------------------ */}

      <div
        className={clsx('absolute', 'inset-0', 'pointer-events-none', 'opacity-[0.035]')}
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 40%,
              rgba(255,255,255,0.9) 0.5px,
              transparent 0.5px
            )
          `,
          backgroundSize: '4px 4px',
        }}
      />

      <div
        className={clsx('absolute', 'left-1/2', 'top-1/3', '-translate-x-1/2', 'w-[700px]', 'h-[400px]', 'rounded-full', 'bg-[#FFB800]/[0.025]', 'blur-[120px]', 'pointer-events-none')}
      />

      {/* ------------------------------------------------ */}
      {/* CONTENT */}
      {/* ------------------------------------------------ */}

      <div className={clsx('relative', 'max-w-[1600px]', 'mx-auto', 'px-5', 'sm:px-8', 'lg:px-12', 'py-24', 'md:py-36')}>

        {/* ------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------ */}

        <div
          className={`
            flex
            items-center
            justify-between
            border-b
            border-white/[0.09]
            pb-5
            mb-16

            transition-all
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }
          `}
        >
          <div className={clsx('flex', 'items-center', 'gap-3')}>

            <span
              className={clsx('relative', 'flex', 'items-center', 'justify-center', 'w-2', 'h-2')}
            >
              <span
                className={clsx('absolute', 'w-3', 'h-3', 'rounded-full', 'bg-[#FFB800]/20', 'animate-ping')}
              />

              <span
                className={clsx('relative', 'w-1.5', 'h-1.5', 'rounded-full', 'bg-[#FFB800]', 'shadow-[0_0_10px_rgba(255,184,0,0.8)]')}
              />
            </span>

            <span
              className={clsx('font-mono', 'text-[10px]', 'sm:text-xs', 'tracking-[0.25em]', 'text-white/50')}
            >
              {eyebrow('showreel')}
            </span>
          </div>

          <span
            className={clsx('hidden', 'sm:block', 'font-mono', 'text-[10px]', 'tracking-[0.25em]', 'text-white/35')}
          >
            {t.eyebrowRight}
          </span>
        </div>

        {/* ------------------------------------------------ */}
        {/* TITLE */}
        {/* ------------------------------------------------ */}

        <div
          className={`
            text-center
            mb-14
            transition-all
            duration-[1200ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }
          `}
        >
          <p
            className={clsx('font-mono', 'text-[10px]', 'tracking-[0.35em]', 'text-[#FFB800]', 'uppercase', 'mb-5')}
          >
            LOST IN FRAME / DIRECTORS CUT
          </p>

          <h2
            className={clsx('font-sans', 'font-bold', 'text-white', 'uppercase', 'tracking-[-0.055em]', 'leading-[0.86]', 'text-5xl', 'sm:text-6xl', 'md:text-7xl', 'lg:text-[7.5rem]')}
          >
            WATCH
            <span className="text-white/25">
              {' '}
              THE FRAME
            </span>
          </h2>

          <p
            className={clsx('max-w-xl', 'mx-auto', 'mt-7', 'font-mono', 'text-[10px]', 'sm:text-xs', 'text-white/40', 'tracking-[0.16em]', 'leading-loose', 'uppercase')}
          >
            {t.caption}
          </p>
        </div>

        {/* ------------------------------------------------ */}
        {/* VIDEO */}
        {/* ------------------------------------------------ */}

        <div
          ref={containerRef}
          onMouseEnter={() => {
            setIsHovering(true);
            setShowControls(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
          className={`
            group
            relative
            mx-auto
            overflow-hidden
            bg-black

            border
            border-white/[0.12]

            transition-all
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isFullscreen
                ? 'w-full h-full border-[#FFB800]/50'
                : `
                  w-full
                  lg:w-[91%]
                  xl:w-[86%]
                  aspect-video
                  hover:border-white/25
                `
            }

            ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-[0.97]'
            }
          `}
        >

          {/* -------------------------------------------- */}
          {/* VIDEO */}
          {/* -------------------------------------------- */}

          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted={isMuted}
            preload="metadata"
            onLoadedMetadata={
              handleLoadedMetadata
            }
            onPlay={handlePlay}
            onPause={handlePause}
            onClick={togglePlay}
            className={`
              absolute
              inset-0
              w-full
              h-full
              object-cover

              cursor-pointer

              transition-transform
              duration-[1800ms]
              ease-out

              ${
                isPlaying
                  ? 'scale-[1.025]'
                  : 'scale-100'
              }
            `}
          />

          {/* -------------------------------------------- */}
          {/* CINEMATIC VIGNETTE */}
          {/* -------------------------------------------- */}

          <div
            className={clsx('absolute', 'inset-0', 'pointer-events-none', 'bg-[radial-gradient(', 'ellipse_at_center,', 'transparent_45%,', 'rgba(0,0,0,0.45)_100%', ')]', 'z-[2]')}
          />

          {/* -------------------------------------------- */}
          {/* TOP / BOTTOM CINEMA BARS */}
          {/* -------------------------------------------- */}

          <div
            className={clsx('absolute', 'top-0', 'left-0', 'right-0', 'h-[5%]', 'bg-black', 'z-[3]', 'pointer-events-none')}
          />

          <div
            className={clsx('absolute', 'bottom-0', 'left-0', 'right-0', 'h-[5%]', 'bg-black', 'z-[3]', 'pointer-events-none')}
          />

          {/* -------------------------------------------- */}
          {/* TOP METADATA */}
          {/* -------------------------------------------- */}

          <div
            className={`
              absolute
              top-6
              left-6
              right-6
              z-10

              flex
              items-center
              justify-between

              font-mono
              text-[9px]
              sm:text-[10px]

              transition-all
              duration-500

              ${
                showControls
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-3'
              }
            `}
          >
            <div className={clsx('flex', 'items-center', 'gap-3')}>

              <span
                className={clsx('px-2', 'py-1', 'border', 'border-white/15', 'bg-black/40', 'backdrop-blur-md', 'text-white/70', 'tracking-[0.18em]')}
              >
                {isPlaying
                  ? 'PLAYING'
                  : 'PAUSED'}
              </span>

              <span
                className={clsx('px-2', 'py-1', 'border', 'border-white/15', 'bg-black/40', 'backdrop-blur-md', 'text-white/45')}
              >
                {formatTime(currentTime)}
                {' / '}
                {formatTime(duration)}
              </span>
            </div>

            <div
              className={clsx('hidden', 'sm:flex', 'items-center', 'gap-3', 'px-3', 'py-1.5', 'border', 'border-white/10', 'bg-black/35', 'backdrop-blur-md', 'text-white/40', 'tracking-[0.15em]')}
            >
              <span className="text-[#FFB800]">
                {t.badge[0]}
              </span>

              <span>
                {t.badge[1]}
              </span>
            </div>
          </div>

          {/* -------------------------------------------- */}
          {/* CENTER PLAY */}
          {/* -------------------------------------------- */}

          {!isPlaying && (
            <button
              onClick={togglePlay}
              aria-label="Play showreel"
              className={clsx('absolute', 'inset-0', 'z-10', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'bg-black/20', 'group/play')}
            >
              <span
                className={clsx('relative', 'flex', 'items-center', 'justify-center', 'w-20', 'h-20', 'sm:w-24', 'sm:h-24', 'rounded-full', 'border', 'border-white/30', 'bg-black/25', 'backdrop-blur-md', 'transition-all', 'duration-500', 'group-hover/play:', 'scale-110', 'group-hover/play:', 'border-[#FFB800]/70', 'group-hover/play:', 'bg-[#FFB800]/10')}
              >
                <Play
                  className={clsx('w-7', 'h-7', 'sm:w-8', 'sm:h-8', 'fill-white', 'text-white', 'ml-1', 'transition-colors', 'duration-300', 'group-hover/play:', 'fill-[#FFB800]', 'group-hover/play:', 'text-[#FFB800]')}
                />

                {/* outer ring */}

                <span
                  className={clsx('absolute', 'inset-[-8px]', 'rounded-full', 'border', 'border-white/[0.08]', 'transition-all', 'duration-700', 'group-hover/play:', 'inset-[-12px]', 'group-hover/play:', 'border-[#FFB800]/20')}
                />
              </span>
            </button>
          )}

          {/* -------------------------------------------- */}
          {/* BOTTOM CONTROLS */}
          {/* -------------------------------------------- */}

          <div
            className={`
              absolute
              bottom-0
              left-0
              right-0
              z-20

              px-5
              sm:px-7
              pb-5
              sm:pb-6

              transition-all
              duration-500

              ${
                showControls
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5 pointer-events-none'
              }
            `}
          >

            {/* SCRUBBER */}

            <div
              onClick={handleSeek}
              className={clsx('relative', 'w-full', 'h-8', 'flex', 'items-center', 'cursor-pointer', 'group/scrub')}
            >
              <div
                className={clsx('relative', 'w-full', 'h-[2px]', 'bg-white/20', 'transition-all', 'duration-300', 'group-hover/scrub:h-[3px]')}
              >
                <div
                  className={clsx('absolute', 'left-0', 'top-0', 'bottom-0', 'bg-[#FFB800]', 'shadow-[0_0_10px_rgba(255,184,0,0.35)]')}
                  style={{
                    width: `${progress}%`,
                  }}
                />

                <div
                  className={clsx('absolute', 'top-1/2', '-translate-y-1/2', 'w-2', 'h-2', 'rounded-full', 'bg-white', 'opacity-0', 'group-hover/scrub:opacity-100', 'transition-opacity', 'duration-200')}
                  style={{
                    left: `calc(${progress}% - 4px)`,
                  }}
                />
              </div>
            </div>

            {/* CONTROL ROW */}

            <div
              className={clsx('flex', 'items-center', 'justify-between', 'mt-1')}
            >

              <div
                className={clsx('flex', 'items-center', 'gap-4')}
              >

                {/* PLAY */}

                <button
                  onClick={togglePlay}
                  aria-label={
                    isPlaying
                      ? 'Pause'
                      : 'Play'
                  }
                  className={clsx('text-white/70', 'hover:text-white', 'transition-colors', 'duration-300')}
                >
                  {isPlaying ? (
                    <Pause className={clsx('w-4', 'h-4')} />
                  ) : (
                    <Play className={clsx('w-4', 'h-4')} />
                  )}
                </button>

                {/* MUTE */}

                <button
                  onClick={toggleMute}
                  aria-label={
                    isMuted
                      ? 'Unmute'
                      : 'Mute'
                  }
                  className={clsx('text-white/70', 'hover:text-[#FFB800]', 'transition-colors', 'duration-300')}
                >
                  {isMuted ? (
                    <VolumeX className={clsx('w-4', 'h-4')} />
                  ) : (
                    <Volume2 className={clsx('w-4', 'h-4')} />
                  )}
                </button>

                {/* TIME */}

                <span
                  className={clsx('hidden', 'sm:block', 'font-mono', 'text-[9px]', 'tracking-[0.18em]', 'text-white/35')}
                >
                  {formatTime(currentTime)}
                  {' / '}
                  {formatTime(duration)}
                </span>
              </div>

              {/* RIGHT */}

              <div className={clsx('flex', 'items-center', 'gap-4')}>

                <span
                  className={clsx('hidden', 'md:block', 'font-mono', 'text-[9px]', 'tracking-[0.2em]', 'text-white/30', 'uppercase')}
                >
                  LOST IN FRAME
                  {' // '}
                  {t.cutLabel}
                </span>

                {/* FULLSCREEN */}

                <button
                  onClick={toggleFullscreen}
                  aria-label="Fullscreen"
                  className={clsx('text-white/70', 'hover:text-[#FFB800]', 'transition-colors', 'duration-300')}
                >
                  <Maximize2 className={clsx('w-4', 'h-4')} />
                </button>
              </div>
            </div>
          </div>

          {/* -------------------------------------------- */}
          {/* FRAME NUMBER */}
          {/* -------------------------------------------- */}

          <div
            className={clsx('absolute', 'bottom-8', 'left-7', 'z-10', 'hidden', 'lg:block', 'font-mono', 'text-[8px]', 'tracking-[0.3em]', 'text-white/25', 'pointer-events-none')}
          >
            {t.frameLabel}
          </div>

        </div>

        {/* ------------------------------------------------ */}
        {/* BELOW VIDEO INFO */}
        {/* ------------------------------------------------ */}

        <div
          className={`
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8

            mt-10
            pt-6

            border-t
            border-white/[0.08]

            transition-all
            duration-[1200ms]
            delay-200

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }
          `}
        >

          <div>
            <span
              className={clsx('font-mono', 'text-[9px]', 'tracking-[0.25em]', 'text-white/25')}
            >
              {t.formatLabel}
            </span>

            <p
              className={clsx('mt-2', 'text-xs', 'text-white/55')}
            >
              {t.formatValue}
            </p>
          </div>

          <div>
            <span
              className={clsx('font-mono', 'text-[9px]', 'tracking-[0.25em]', 'text-white/25')}
            >
              {t.directionLabel}
            </span>

            <p
              className={clsx('mt-2', 'text-xs', 'text-white/55')}
            >
              {t.directionValue}
            </p>
          </div>

          <div
            className="
              md:text-right
            "
          >
            <span
              className={clsx('font-mono', 'text-[9px]', 'tracking-[0.25em]', 'text-white/25')}
            >
              {t.exploreLabel}
            </span>

            <p
              className={clsx('mt-2', 'inline-flex', 'items-center', 'gap-2', 'text-xs', 'text-white/55')}
            >
              {t.exploreValue}

              <ArrowUpRight
                className={clsx('w-3', 'h-3', 'text-[#FFB800]')}
              />
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
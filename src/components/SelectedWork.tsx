import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Play } from 'lucide-react';
import clsx from 'clsx';

import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/projects';
import { soundEngine } from '../utils/audioSynth';
import { section, eyebrow } from '../data/site';
import { PROJECTS_YEAR_RANGE } from '../data/projects';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCardItem: React.FC<ProjectCardProps> = ({
  project,
  index,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillsRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  /*
   * ---------------------------------------------------------
   * GSAP SCROLL REVEAL
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            end: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, card);

    return () => ctx.revert();
  }, []);

  /*
   * ---------------------------------------------------------
   * GSAP IMAGE PARALLAX
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const stills = stillsRef.current;

    if (!card || !image || !stills) return;

    const imageY = gsap.quickTo(image, 'y', {
      duration: 0.45,
      ease: 'power3.out',
    });

    const stillsY = gsap.quickTo(stills, 'y', {
      duration: 0.55,
      ease: 'power3.out',
    });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();

      const relativeX =
        (event.clientX - rect.left) / rect.width - 0.5;

      const relativeY =
        (event.clientY - rect.top) / rect.height - 0.5;

      imageY(relativeY * -28);

      gsap.to(image, {
        x: relativeX * 12,
        scale: 1.08,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      gsap.to(stills, {
        x: relativeX * 8,
        y: relativeY * -18,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1.03,
        duration: 0.8,
        ease: 'power4.out',
      });

      gsap.to(stills, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power4.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * VIDEO HOVER
   * ---------------------------------------------------------
   */
  const handleMouseEnter = () => {
    setIsHovered(true);

    soundEngine.playLensTick(1.1);

    if (videoRef.current && project.heroVideo) {
      videoRef.current.currentTime = 0;

      videoRef.current
        .play()
        .then(() => {
          setIsVideoReady(true);
        })
        .catch(() => {
          setIsVideoReady(false);
        });
    }

    /*
     * Small cinematic entrance
     */
    if (imageWrapRef.current) {
      gsap.to(imageWrapRef.current, {
        scale: 1.015,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (imageWrapRef.current) {
      gsap.to(imageWrapRef.current, {
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
  };

  /*
   * ---------------------------------------------------------
   * CLICK
   * ---------------------------------------------------------
   */
  const handleClick = () => {
    soundEngine.playShutter();
    onClick();
  };

  /*
   * Your project data already contains different numbers
   * of stills per project, so we simply use what exists.
   */
  const stills = project.stills ?? [];

  return (
    <article
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx('group', 'relative', 'border-b', 'border-white/10', 'py-16', 'md:py-24', 'cursor-pointer', 'overflow-hidden')}
    >
      {/* =====================================================
          HOVER BACKGROUND
      ===================================================== */}

      <div
        className={clsx('absolute', 'inset-0', 'pointer-events-none', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-700')}
      >
        <div
          className={clsx('absolute', 'inset-0', 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,51,51,0.06),transparent_55%)]')}
        />
      </div>

      {/* =====================================================
          PROJECT GRID
      ===================================================== */}

      <div
        className={clsx('relative', 'z-10', 'grid', 'grid-cols-1', 'lg:grid-cols-12', 'gap-10', 'lg:gap-12', 'items-center')}
      >
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="lg:col-span-3">
          <div className={clsx('flex', 'items-start', 'gap-5')}>
            {/* Project number */}

            <div className={clsx('pt-1', 'shrink-0')}>
              <span
                className={clsx('font-mono', 'text-xs', 'md:text-sm', 'text-[#0066FF]', 'tracking-widest', 'font-bold')}
              >
                [{project.id}]
              </span>
            </div>

            {/* =================================================
                STILL STACK
            ================================================= */}

            <div
              ref={stillsRef}
              className={clsx('hidden', 'sm:flex', 'flex-col', 'gap-2', 'w-24', 'md:w-28', 'will-change-transform')}
            >
              {stills.slice(0, 5).map((still, stillIndex) => (
                <div
                  key={`${project.id}-${stillIndex}`}
                  className={clsx('relative', 'aspect-video', 'overflow-hidden', 'border', 'border-white/10', 'bg-black', 'transition-all', 'duration-500', 'group-hover:border-[#0066FF]/50')}
                >
                  <img
                    src={still.url}
                    alt={still.caption}
                    loading="lazy"
                    className={clsx('w-full', 'h-full', 'object-cover', 'transition-all', 'duration-700', 'group-hover:scale-110')}
                  />

                  <div
                    className={clsx('absolute', 'inset-0', 'bg-black/30', 'group-hover:bg-transparent', 'transition-colors', 'duration-500')}
                  />

                  <span
                    className={clsx('absolute', 'bottom-1', 'right-1', 'font-mono', 'text-[7px]', 'text-white/60', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity')}
                  >
                    {still.frameNo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile category */}

          <div className={clsx('sm:hidden', 'mt-5')}>
            <span
              className={clsx('font-mono', 'text-[10px]', 'text-white/40', 'tracking-widest', 'uppercase')}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* ===================================================
            CENTER MEDIA
        =================================================== */}

        <div
          ref={imageWrapRef}
          className={clsx('lg:col-span-6', 'relative', 'aspect-video', 'overflow-hidden', 'border', 'border-white/15', 'bg-black', 'shadow-[0_30px_100px_rgba(0,0,0,0.55)]', 'transition-all', 'duration-500', 'group-hover:border-[#0066FF]/70')}
        >
          {/* Media */}

          <div className={clsx('absolute', 'inset-[-5%]', 'overflow-hidden')}>
            {/* Hero image */}

            <img
              ref={imageRef}
              src={project.heroImage}
              alt={project.title}
              loading="lazy"
              className={clsx('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'scale-[1.03]', 'brightness-[0.82]', 'contrast-[1.05]', 'transition-opacity', 'duration-700')}
              style={{
                opacity: isHovered && isVideoReady ? 0 : 1,
              }}
            />

            {/* Hero video */}

            {project.heroVideo && (
              <video
                ref={videoRef}
                src={project.heroVideo}
                muted
                loop
                playsInline
                preload="metadata"
                className={clsx('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'scale-[1.03]', 'transition-opacity', 'duration-700')}
                style={{
                  opacity: isHovered && isVideoReady ? 1 : 0,
                }}
              />
            )}
          </div>

          {/* Cinematic gradient */}

          <div
            className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/70', 'via-transparent', 'to-black/20', 'pointer-events-none')}
          />

          {/* Blue cinematic edge */}

          <div
            className={clsx('absolute', 'inset-0', 'border', 'border-[#0066FF]/0', 'group-hover:border-[#0066FF]/30', 'transition-all', 'duration-700', 'pointer-events-none')}
          />

          {/* =================================================
              TOP METADATA
          ================================================= */}

          <div
            className={clsx('absolute', 'top-4', 'left-4', 'right-4', 'flex', 'items-center', 'justify-between', 'font-mono', 'text-[9px]', 'tracking-widest', 'uppercase', 'pointer-events-none')}
          >
            <span
              className={clsx('px-2', 'py-1', 'bg-black/50', 'backdrop-blur-md', 'border', 'border-white/10', 'text-white/60')}
            >
              {project.year}
            </span>

            <span
              className={clsx('px-2', 'py-1', 'bg-black/50', 'backdrop-blur-md', 'border', 'border-white/10', 'text-white/60')}
            >
              {project.aspectRatio}
            </span>
          </div>

          {/* =================================================
              CENTER VIEW BUTTON
          ================================================= */}

          <div
            className={clsx('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'pointer-events-none')}
          >
            <div
              className={clsx('flex', 'items-center', 'gap-3', 'px-5', 'py-3', 'bg-black/75', 'backdrop-blur-xl', 'border', 'border-[#0066FF]', 'text-white', 'font-mono', 'text-[10px]', 'tracking-[0.2em]', 'uppercase', 'opacity-0', 'scale-90', 'group-hover:opacity-100', 'group-hover:scale-100', 'transition-all', 'duration-500')}
            >
              <Play
                className={clsx('w-3', 'h-3', 'fill-[#0066FF]', 'text-[#0066FF]')}
              />

              <span>{section('work').viewCta}</span>

              <ArrowUpRight
                className={clsx('w-4', 'h-4', 'text-[#0066FF]')}
              />
            </div>
          </div>

          {/* =================================================
              BOTTOM MEDIA INFO
          ================================================= */}

          <div
            className={clsx('absolute', 'bottom-4', 'left-4', 'right-4', 'flex', 'items-end', 'justify-between', 'pointer-events-none')}
          >
            <div>
              <span
                className={clsx('font-mono', 'text-[9px]', 'text-white/50', 'tracking-widest', 'uppercase')}
              >
                {project.client}
              </span>
            </div>

            {project.metrics?.views && (
              <span
                className={clsx('font-mono', 'text-[9px]', 'text-white/50')}
              >
                {project.metrics.views} VIEWS
              </span>
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT INFORMATION
        =================================================== */}

        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Title */}

            <div>
              <div
                className={clsx('flex', 'items-center', 'justify-between', 'mb-3')}
              >
                <span
                  className={clsx('font-mono', 'text-[10px]', 'text-[#0066FF]', 'tracking-widest', 'uppercase')}
                >
                  {project.category}
                </span>

                <ArrowUpRight
                  className={clsx('w-5', 'h-5', 'text-white/20', 'group-hover:text-[#0066FF]', 'group-hover:translate-x-1', 'group-hover:-translate-y-1', 'transition-all', 'duration-500')}
                />
              </div>

              <h3
                className={clsx('font-sans', 'text-3xl', 'md:text-4xl', 'font-medium', 'text-white', 'tracking-tight', 'leading-none', 'group-hover:text-[#0066FF]', 'transition-colors', 'duration-500')}
              >
                {project.title}
              </h3>
            </div>

            {/* Description */}

            <p
              className={clsx('font-sans', 'text-sm', 'text-white/60', 'font-light', 'leading-relaxed')}
            >
              <span className={clsx('font-mono', 'text-[#0066FF]')}>
                [
              </span>{' '}
              {project.description}{' '}
              <span className={clsx('font-mono', 'text-[#0066FF]')}>
                ]
              </span>
            </p>

            {/* Metadata */}

            <div
              className={clsx('border-t', 'border-white/10', 'pt-5', 'space-y-2', 'font-mono', 'text-[10px]', 'text-white/45', 'tracking-wider', 'uppercase')}
            >
              <div className={clsx('flex', 'justify-between', 'gap-4')}>
                <span>{section('work').clientLabel}</span>

                <span className={clsx('text-white/70', 'text-right')}>
                  {project.client}
                </span>
              </div>

              <div className={clsx('flex', 'justify-between', 'gap-4')}>
                <span>{section('work').directorLabel}</span>

                <span className={clsx('text-white/70', 'text-right')}>
                  {project.director}
                </span>
              </div>

              <div className={clsx('flex', 'justify-between', 'gap-4')}>
                <span>{section('work').durationLabel}</span>

                <span className="text-white/70">
                  {project.duration}
                </span>
              </div>
            </div>

            {/* Award */}

            {project.metrics?.awards && (
              <div
                className={clsx('pt-2', 'font-mono', 'text-[9px]', 'text-[#0066FF]', 'leading-relaxed', 'tracking-wider', 'uppercase')}
              >
                {project.metrics.awards}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  onSelectProject,
}) => {
  // Labels come from sections.json → "work"
  const t = section('work');

  return (
    <section
      id="work"
      className={clsx('relative', 'bg-[#000000]', 'border-t', 'border-white/10', 'overflow-hidden')}
    >
      <div className={clsx('max-w-[1440px]', 'mx-auto', 'px-6', 'md:px-12')}>
        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className={clsx('py-20', 'md:py-28')}>
          <div
            className={clsx('flex', 'flex-col', 'md:flex-row', 'md:items-end', 'md:justify-between', 'gap-8', 'border-b', 'border-white/10', 'pb-10')}
          >
            <div>
              <div
                className={clsx('flex', 'items-center', 'gap-3', 'font-mono', 'text-[10px]', 'text-white/40', 'tracking-[0.25em]', 'uppercase', 'mb-6')}
              >
                <span
                  className={clsx('w-1.5', 'h-1.5', 'rounded-full', 'bg-[#0066FF]', 'shadow-[0_0_10px_rgba(0,102,255,0.7)]')}
                />

                <span>{eyebrow('work')}</span>
              </div>

              <h2
                className={clsx('font-sans', 'text-5xl', 'sm:text-7xl', 'md:text-8xl', 'font-medium', 'text-white', 'tracking-[-0.04em]', 'leading-[0.85]')}
              >
                {t.titleLine1}
                <br />

                <span className="text-white/30">
                  {t.titleLine2}
                </span>
              </h2>
            </div>

            <div className="max-w-md">
              <p
                className={clsx('font-sans', 'text-sm', 'md:text-base', 'text-white/50', 'font-light', 'leading-relaxed')}
              >
                {t.intro}
              </p>

              <div
                className={clsx('mt-5', 'font-mono', 'text-[9px]', 'text-[#0066FF]', 'tracking-[0.2em]', 'uppercase')}
              >
                {String(PROJECTS_DATA.length).padStart(2, '0')} PROJECTS // {PROJECTS_YEAR_RANGE}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            PROJECT LIST
        =================================================== */}

        <div>
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCardItem
              key={project.id}
              project={project}
              index={index}
              onClick={() => onSelectProject(project)}
            />
          ))}
        </div>

        {/* ===================================================
            END MARKER
        =================================================== */}

        <div
          className={clsx('py-24', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center')}
        >
          <div
            className={clsx('w-px', 'h-16', 'bg-gradient-to-b', 'from-[#0066FF]', 'to-transparent', 'mb-6')}
          />

          <span
            className={clsx('font-mono', 'text-[9px]', 'text-white/30', 'tracking-[0.3em]', 'uppercase')}
          >
            {t.endLabel}
          </span>
        </div>
      </div>
    </section>
  );
};
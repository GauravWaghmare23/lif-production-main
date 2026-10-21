import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { SERVICES_DATA } from '../data/services';
import { soundEngine } from '../utils/audioSynth';
import { section, eyebrow } from '../data/site';

interface ServicesProps {
  onOpenInquiry: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenInquiry }) => {
  // Services come from src/data/services.json, labels from sections.json → "services"
  const t = section('services');
  const [activeService, setActiveService] = useState(SERVICES_DATA[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const activeNumberRef = useRef<HTMLSpanElement>(null);

  /*
   * ---------------------------------------------------------
   * INITIAL SECTION ANIMATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const headerItems = headerRef.current?.children;
      const serviceItems = listRef.current?.children;

      gsap.set(headerItems || [], {
        opacity: 0,
        y: 20,
      });

      gsap.set(serviceItems || [], {
        opacity: 0,
        y: 35,
      });

      gsap.set(panelRef.current, {
        opacity: 0,
        y: 35,
        scale: 0.98,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(headerItems || [], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
      })
        .to(
          serviceItems || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          '-=0.35'
        )
        .to(
          panelRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
          },
          '-=0.55'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
   * ---------------------------------------------------------
   * ACTIVE SERVICE CHANGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!panelRef.current) return;

    const ctx = gsap.context(() => {
      const elements = panelRef.current?.querySelectorAll(
        '[data-service-content]'
      );

      gsap.fromTo(
        elements || [],
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        panelRef.current,
        {
          borderColor: 'rgba(255,184,0,0.05)',
        },
        {
          borderColor: 'rgba(255,184,0,0.25)',
          duration: 0.5,
          ease: 'power2.out',
        }
      );

      if (activeNumberRef.current) {
        gsap.fromTo(
          activeNumberRef.current,
          {
            opacity: 0,
            x: -8,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: 'power2.out',
          }
        );
      }
    }, panelRef);

    return () => ctx.revert();
  }, [activeService]);

  /*
   * ---------------------------------------------------------
   * VIDEO / IMAGE TRANSITION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const video = mediaRef.current;

    if (!video) return;

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser autoplay restrictions.
      }
    };

    playVideo();
  }, [activeService]);

  /*
   * ---------------------------------------------------------
   * SERVICE HOVER
   * ---------------------------------------------------------
   */

  const handleHover = (service: typeof SERVICES_DATA[0]) => {
    if (activeService.id === service.id) return;

    setActiveService(service);
    soundEngine.playLensTick(1.1);
  };

  /*
   * ---------------------------------------------------------
   * OPEN INQUIRY
   * ---------------------------------------------------------
   */

  const handleInquiry = () => {
    soundEngine.playShutter();
    onOpenInquiry();
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className={clsx('relative', 'py-24', 'md:py-32', 'bg-[#050505]', 'border-t', 'border-white/10', 'overflow-hidden')}
    >
      {/* =====================================================
          SUBTLE BACKGROUND MEDIA
      ===================================================== */}

      <div className={clsx('absolute', 'inset-0', 'pointer-events-none', 'overflow-hidden')}>
        {activeService.videoUrl && (
          <video
            key={activeService.id}
            ref={mediaRef}
            src={activeService.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={clsx('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'opacity-[0.07]', 'grayscale', 'contrast-125', 'scale-105')}
          />
        )}

        <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-b', 'from-[#050505]', 'via-[#050505]/95', 'to-[#050505]')} />

        <div
          className={clsx('absolute', 'inset-0', 'opacity-[0.035]', 'bg-[radial-gradient(circle_at_center,white_0.7px,transparent_0.7px)]', 'bg-[length:8px_8px]')}
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className={clsx('relative', 'z-10', 'max-w-[1440px]', 'mx-auto', 'px-6', 'md:px-12')}>

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div
          ref={headerRef}
          className={clsx('flex', 'flex-col', 'md:flex-row', 'md:items-end', 'md:justify-between', 'gap-6', 'border-b', 'border-white/10', 'pb-5', 'mb-16')}
        >
          <div>
            <div className={clsx('flex', 'items-center', 'gap-3', 'mb-4')}>
              <span
                className={clsx('w-1.5', 'h-1.5', 'rounded-full', 'bg-cine-gold', 'shadow-[0_0_10px_#00F0FF]')}
              />

              <span
                className={clsx('font-mono', 'text-[10px]', 'tracking-[0.28em]', 'text-cine-muted', 'uppercase')}
              >
                {eyebrow('services')}
              </span>
            </div>

            <h2
              className={clsx('font-sans', 'text-4xl', 'md:text-6xl', 'lg:text-7xl', 'font-medium', 'text-white', 'tracking-tight', 'leading-none')}
            >
              {t.title}<span className="text-cine-gold">.</span>
            </h2>
          </div>

          <p
            className={clsx('max-w-xs', 'font-mono', 'text-[10px]', 'leading-relaxed', 'tracking-[0.16em]', 'text-white/40', 'uppercase', 'md:text-right')}
          >
            {t.tagline[0]}
            <br />
            {t.tagline[1]}
          </p>
        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-12', 'gap-10', 'lg:gap-16')}>

          {/* =================================================
              SERVICE LIST
          ================================================= */}

          <div className="lg:col-span-7">

            <div
              className={clsx('font-mono', 'text-[10px]', 'tracking-[0.2em]', 'uppercase', 'text-white/30', 'mb-5')}
            >
              {t.selectLabel}
            </div>

            <div
              ref={listRef}
              className={clsx('border-t', 'border-white/10')}
            >
              {SERVICES_DATA.map((service) => {
                const isActive = activeService.id === service.id;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onMouseEnter={() => handleHover(service)}
                    onFocus={() => handleHover(service)}
                    onClick={handleInquiry}
                    data-cursor="INQUIRE"
                    className={clsx('group', 'relative', 'w-full', 'text-left', 'border-b', 'border-white/10', 'py-6', 'md:py-7', 'cursor-pointer', 'outline-none')}
                  >
                    {/* Active line */}

                    <span
                      className={clsx('absolute', 'left-0', 'top-0', 'bottom-0', 'w-[2px]', 'bg-cine-gold', 'origin-top', 'transition-transform', 'duration-500')}
                      style={{
                        transform: isActive
                          ? 'scaleY(1)'
                          : 'scaleY(0)',
                      }}
                    />

                    <div className={clsx('flex', 'items-center', 'justify-between', 'gap-6', 'pl-5')}>

                      {/* LEFT */}

                      <div className={clsx('flex', 'items-center', 'gap-5')}>

                        <span
                          className={`
                            font-mono
                            text-[10px]
                            tracking-widest
                            transition-colors
                            duration-300
                            ${
                              isActive
                                ? 'text-cine-gold'
                                : 'text-white/25 group-hover:text-cine-gold'
                            }
                          `}
                        >
                          {service.number}
                        </span>

                        <span
                          className={`
                            font-sans
                            text-3xl
                            sm:text-4xl
                            md:text-5xl
                            font-medium
                            tracking-tight
                            leading-none
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? 'text-white translate-x-1'
                                : 'text-white/35 group-hover:text-white group-hover:translate-x-1'
                            }
                          `}
                        >
                          {service.title}
                        </span>
                      </div>

                      {/* RIGHT */}

                      <div className={clsx('relative', 'shrink-0')}>

                        <div
                          className={`
                            w-9
                            h-9
                            rounded-full
                            border
                            flex
                            items-center
                            justify-center
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? 'border-cine-gold bg-cine-gold text-black rotate-45'
                                : 'border-white/15 text-white/30 group-hover:border-cine-gold group-hover:text-cine-gold'
                            }
                          `}
                        >
                          <Plus className={clsx('w-4', 'h-4')} />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle */}

                    <div
                      className={`
                        pl-[4.1rem]
                        mt-3
                        font-mono
                        text-[9px]
                        tracking-[0.18em]
                        uppercase
                        transition-all
                        duration-500
                        ${
                          isActive
                            ? 'opacity-100 text-cine-gold'
                            : 'opacity-40 text-white/30'
                        }
                      `}
                    >
                      {service.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              ACTIVE SERVICE PANEL
          ================================================= */}

          <div
            ref={panelRef}
            className={clsx('lg:col-span-5', 'lg:sticky', 'lg:top-24', 'self-start', 'overflow-hidden', 'border', 'border-white/10', 'bg-[#0a0a0a]/90', 'backdrop-blur-xl')}
          >

            {/* MEDIA */}

            <div className={clsx('relative', 'aspect-[16/9]', 'overflow-hidden', 'border-b', 'border-white/10')}>

              {activeService.videoUrl && (
                <video
                  key={activeService.id}
                  src={activeService.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={clsx('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'grayscale', 'contrast-125', 'brightness-75', 'scale-105', 'transition-transform', 'duration-[1.5s]')}
                />
              )}

              <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black', 'via-transparent', 'to-black/20')} />

              <div className={clsx('absolute', 'top-5', 'left-5', 'right-5', 'flex', 'items-center', 'justify-between')}>

                <span
                  className={clsx('font-mono', 'text-[9px]', 'tracking-[0.2em]', 'text-white/60', 'uppercase')}
                >
                  Discipline
                </span>

                <span
                  ref={activeNumberRef}
                  className={clsx('font-mono', 'text-[10px]', 'tracking-[0.2em]', 'text-cine-gold')}
                >
                  {activeService.number}
                </span>
              </div>

              <div className={clsx('absolute', 'bottom-5', 'left-5')}>

                <span
                  data-service-content
                  className={clsx('font-mono', 'text-[9px]', 'tracking-[0.2em]', 'text-cine-gold', 'uppercase')}
                >
                  {activeService.subtitle}
                </span>

              </div>
            </div>

            {/* CONTENT */}

            <div className={clsx('p-6', 'md:p-8')}>

              <div className={clsx('flex', 'items-start', 'justify-between', 'gap-5', 'mb-5')}>

                <h3
                  data-service-content
                  className={clsx('font-sans', 'text-2xl', 'md:text-3xl', 'font-medium', 'text-white', 'tracking-tight')}
                >
                  {activeService.title}
                  <span className="text-cine-gold">.</span>
                </h3>

                <span
                  data-service-content
                  className={clsx('font-mono', 'text-[9px]', 'text-white/25', 'tracking-widest')}
                >
                  04 / 0{activeService.number}
                </span>

              </div>

              <p
                data-service-content
                className={clsx('font-sans', 'text-sm', 'md:text-[15px]', 'leading-7', 'text-white/55', 'max-w-lg', 'mb-7')}
              >
                {activeService.description}
              </p>

              {/* TAGS */}

              <div
                data-service-content
                className={clsx('border-t', 'border-white/10', 'pt-5', 'mb-7')}
              >
                <div
                  className={clsx('font-mono', 'text-[9px]', 'text-white/30', 'tracking-[0.2em]', 'uppercase', 'mb-3')}
                >
                  {t.competenciesLabel}
                </div>

                <div className={clsx('flex', 'flex-wrap', 'gap-2')}>
                  {activeService.tags.map((tag) => (
                    <span
                      key={tag}
                      className={clsx('px-3', 'py-1.5', 'border', 'border-white/10', 'bg-white/[0.025]', 'font-mono', 'text-[9px]', 'tracking-wider', 'text-white/55', 'transition-colors', 'duration-300', 'hover:border-cine-gold/40', 'hover:text-cine-gold')}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}

              <button
                type="button"
                onClick={handleInquiry}
                data-cursor="BRIEF"
                className={clsx('group', 'w-full', 'py-4', 'border', 'border-cine-gold/50', 'text-cine-gold', 'hover:bg-cine-gold', 'hover:text-black', 'font-mono', 'text-[10px]', 'font-bold', 'tracking-[0.18em]', 'uppercase', 'flex', 'items-center', 'justify-between', 'px-5', 'transition-all', 'duration-300')}
              >
                <span>
                  {t.cta}
                </span>

                <ArrowUpRight
                  className={clsx('w-4', 'h-4', 'transition-transform', 'duration-300', 'group-hover:translate-x-1', 'group-hover:-translate-y-1')}
                />
              </button>

            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM MICRO LINE
        =================================================== */}

        <div className={clsx('mt-16', 'flex', 'items-center', 'gap-4')}>

          <span className={clsx('w-8', 'h-px', 'bg-cine-gold')} />

          <span
            className={clsx('font-mono', 'text-[9px]', 'tracking-[0.2em]', 'uppercase', 'text-white/25')}
          >
            {t.footerLabel}
          </span>

        </div>

      </div>
    </section>
  );
};
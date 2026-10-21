import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "../types";
import { PROJECTS_DATA } from "../data/projects";
import { section, sectionNumber } from "../data/site";
import { soundEngine } from "../utils/audioSynth";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollCardsProps {
  onSelectProject: (project: Project) => void;
}

/* =========================================================
   CARD SIZE PATTERN

   LARGE → MEDIUM → SMALL → LARGE...
========================================================= */

const CARD_SIZES = [
  "large",
  "medium",
  "small",
  "large",
  "medium",
  "small",
  "large",
  "medium",
] as const;

export const HorizontalScrollCards: React.FC<
  HorizontalScrollCardsProps
> = ({ onSelectProject }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /*
   * Individual card refs
   */
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  /*
   * Image refs
   */
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  /*
   * Progress indicator
   */
  const progressRef = useRef<HTMLDivElement>(null);

  /*
   * Header refs
   */
  const headerRef = useRef<HTMLDivElement>(null);
  const sideLabelRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  /*
   * Project data comes directly from PROJECTS_DATA.
   */
  const projects = PROJECTS_DATA;

  /* =========================================================
     PROJECT CLICK
  ========================================================= */

  const handleProjectClick = (project: Project) => {
    soundEngine.playShutter();
    onSelectProject(project);
  };

  /* =========================================================
     MOUSE ENTER
  ========================================================= */

  const handleMouseEnter = () => {
    soundEngine.playLensTick(0.7);
  };

  /* =========================================================
     GSAP SYSTEM
  ========================================================= */

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track || projects.length === 0) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         INITIAL STATES
      ===================================================== */

      gsap.set(headerRef.current, {
        y: -30,
        opacity: 0,
      });

      gsap.set(sideLabelRef.current, {
        x: -20,
        opacity: 0,
      });

      gsap.set(scrollIndicatorRef.current, {
        y: 20,
        opacity: 0,
      });

      gsap.set(cardRefs.current.filter(Boolean), {
        opacity: 0,
        y: 80,
        rotateX: 4,
      });

      /* =====================================================
         ENTRANCE ANIMATION
      ===================================================== */

      const intro = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      intro
        .to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.1,
        })
        .to(
          sideLabelRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
          },
          "-=0.7",
        )
        .to(
          scrollIndicatorRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          "-=0.6",
        )
        .to(
          cardRefs.current.filter(Boolean),
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: {
              amount: 0.9,
              from: "start",
            },
          },
          "-=0.5",
        );

      /* =====================================================
         HORIZONTAL DISTANCE
      ===================================================== */

      const getDistance = () => {
        return Math.max(
          0,
          track.scrollWidth - window.innerWidth,
        );
      };

      /* =====================================================
         HORIZONTAL SCROLL
      ===================================================== */

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () =>
            `+=${Math.max(
              getDistance() * 1.25,
              window.innerHeight * 3.5,
            )}`,

          pin: true,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const progress = self.progress;

            /* =================================================
               GLOBAL PROGRESS
            ================================================= */

            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: progress,
              });
            }

            /* =================================================
               IMAGE PARALLAX
            ================================================= */

            imageRefs.current.forEach((image, index) => {
              if (!image) return;

              const direction =
                index % 2 === 0 ? -1 : 1;

              gsap.set(image, {
                xPercent:
                  progress * 8 * direction,
                yPercent:
                  Math.sin(
                    progress * Math.PI * 2 +
                      index * 0.5,
                  ) * 2,
              });
            });

            /* =================================================
               CARD FLOATING MOTION
            ================================================= */

            cardRefs.current.forEach((card, index) => {
              if (!card) return;

              const cardProgress =
                index /
                Math.max(projects.length - 1, 1);

              const distance = Math.abs(
                progress - cardProgress,
              );

              /*
               * Cards closer to current scroll position
               * become slightly larger.
               */

              const scale = gsap.utils.clamp(
                0.94,
                1,
                1 - distance * 0.08,
              );

              /*
               * Floating vertical motion
               */

              const float =
                Math.sin(
                  progress * Math.PI * 2 +
                    index * 0.8,
                ) * 8;

              gsap.set(card, {
                scale,
                y: float,
              });
            });
          },
        },
      });

      /* =====================================================
         CARD HOVER MOTION
      ===================================================== */

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const image = imageRefs.current[index];

        const quickX = gsap.quickTo(card, "x", {
          duration: 0.5,
          ease: "power3.out",
        });

        const quickY = gsap.quickTo(card, "y", {
          duration: 0.5,
          ease: "power3.out",
        });

        const quickRotateX = gsap.quickTo(
          card,
          "rotationX",
          {
            duration: 0.5,
            ease: "power3.out",
          },
        );

        const quickRotateY = gsap.quickTo(
          card,
          "rotationY",
          {
            duration: 0.5,
            ease: "power3.out",
          },
        );

        const handleMove = (
          event: MouseEvent,
        ) => {
          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;

          const rotateY =
            (x / rect.width) * 5;

          const rotateX =
            -(y / rect.height) * 5;

          quickX((x / rect.width) * 5);
          quickY((y / rect.height) * 5);

          quickRotateX(rotateX);
          quickRotateY(rotateY);
        };

        const handleEnter = () => {
          gsap.to(card, {
            scale: 1.015,
            duration: 0.7,
            ease: "power3.out",
          });

          gsap.to(card, {
            boxShadow:
              "0 30px 100px rgba(0,0,0,0.55)",
            duration: 0.6,
          });

          if (image) {
            gsap.to(image, {
              scale: 1.06,
              filter:
                "grayscale(0%) contrast(110%) brightness(0.9)",
              duration: 1,
              ease: "power3.out",
            });
          }

          const title =
            card.querySelector(
              ".horizontal-card-title",
            );

          if (title) {
            gsap.to(title, {
              x: 10,
              duration: 0.6,
              ease: "power3.out",
            });
          }

          const accent =
            card.querySelector(
              ".horizontal-card-accent",
            );

          if (accent) {
            gsap.to(accent, {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 0.7,
              ease: "power4.out",
            });
          }
        };

        const handleLeave = () => {
          quickX(0);
          quickY(0);
          quickRotateX(0);
          quickRotateY(0);

          gsap.to(card, {
            scale: 1,
            boxShadow:
              "0 0 0 rgba(0,0,0,0)",
            duration: 0.8,
            ease: "power3.out",
          });

          if (image) {
            gsap.to(image, {
              scale: 1,
              filter:
                "grayscale(100%) contrast(110%) brightness(0.72)",
              duration: 1,
              ease: "power3.out",
            });
          }

          const title =
            card.querySelector(
              ".horizontal-card-title",
            );

          if (title) {
            gsap.to(title, {
              x: 0,
              duration: 0.6,
              ease: "power3.out",
            });
          }

          const accent =
            card.querySelector(
              ".horizontal-card-accent",
            );

          if (accent) {
            gsap.to(accent, {
              scaleX: 0,
              duration: 0.5,
              ease: "power3.inOut",
            });
          }
        };

        card.addEventListener(
          "mousemove",
          handleMove,
        );

        card.addEventListener(
          "mouseenter",
          handleEnter,
        );

        card.addEventListener(
          "mouseleave",
          handleLeave,
        );

        return () => {
          card.removeEventListener(
            "mousemove",
            handleMove,
          );

          card.removeEventListener(
            "mouseenter",
            handleEnter,
          );

          card.removeEventListener(
            "mouseleave",
            handleLeave,
          );
        };
      });

      /* =====================================================
         END ARCHIVE ANIMATION
      ===================================================== */

      const endArchive =
        section.querySelector(
          ".horizontal-end-archive",
        );

      if (endArchive) {
        gsap.fromTo(
          endArchive,
          {
            opacity: 0,
            y: 40,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",

            scrollTrigger: {
              trigger: endArchive,
              containerAnimation:
                horizontalTween,
              start: "left 85%",
              end: "left 35%",
              scrub: true,
            },
          },
        );
      }

      /* =====================================================
         REFRESH
      ===================================================== */

      ScrollTrigger.refresh();
    }, section);

    return () => {
      ctx.revert();
    };
  }, [projects.length]);

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!projects.length) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className={clsx(
        "relative",
        "h-screen",
        "overflow-hidden",
        "bg-[#000000]",
        "border-y",
        "border-white/10",
        "select-none",
      )}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        ref={headerRef}
        className={clsx(
          "absolute",
          "top-0",
          "left-0",
          "right-0",
          "z-40",
          "px-6",
          "md:px-12",
          "pt-8",
        )}
      >
        <div
          className={clsx(
            "flex",
            "items-center",
            "justify-between",
            "border-b",
            "border-white/10",
            "pb-4",
          )}
        >
          <div
            className={clsx(
              "flex",
              "items-center",
              "gap-3",
            )}
          >
            <span
              className={clsx(
                "relative",
                "flex",
                "items-center",
                "justify-center",
                "w-2",
                "h-2",
              )}
            >
              <span
                className={clsx(
                  "absolute",
                  "inset-0",
                  "rounded-full",
                  "bg-[#0066FF]",
                  "animate-ping",
                  "opacity-40",
                )}
              />

              <span
                className={clsx(
                  "relative",
                  "w-1.5",
                  "h-1.5",
                  "rounded-full",
                  "bg-[#0066FF]",
                  "shadow-[0_0_12px_#0066FF]",
                )}
              />
            </span>

            <span
              className={clsx(
                "font-mono",
                "text-[10px]",
                "md:text-xs",
                "tracking-[0.35em]",
                "text-white/60",
                "uppercase",
              )}
            >
              {sectionNumber('archive')}.1 // {section('archive').archiveEyebrow}
            </span>
          </div>

          <span
            className={clsx(
              "hidden",
              "md:block",
              "font-mono",
              "text-[10px]",
              "tracking-[0.3em]",
              "text-white/40",
              "uppercase",
            )}
          >
            {section('archive').archiveHint}
          </span>
        </div>
      </div>

      {/* =====================================================
          HORIZONTAL TRACK
      ===================================================== */}

      <div
        ref={trackRef}
        className={clsx(
          "absolute",
          "left-0",
          "top-0",
          "flex",
          "h-full",
          "items-center",
          "gap-8",
          "md:gap-12",
          "px-[8vw]",
          "md:px-[12vw]",
          "will-change-transform",
          "perspective-[1200px]",
        )}
      >
        {projects.map((project, index) => {
          const size =
            CARD_SIZES[
              index % CARD_SIZES.length
            ];

          const isLarge = size === "large";
          const isMedium = size === "medium";
          const isSmall = size === "small";

          return (
            <article
              key={project.id}
              ref={(element) => {
                cardRefs.current[index] =
                  element;
              }}
              onClick={() =>
                handleProjectClick(project)
              }
              onMouseEnter={handleMouseEnter}
              className={clsx(
                "horizontal-card",
                "relative",
                "flex-shrink-0",
                "overflow-hidden",
                "border",
                "border-white/15",
                "bg-[#080808]",
                "group",
                "cursor-pointer",
                "select-none",
                "will-change-transform",
                "transform-gpu",
                "transition-[border-color]",
                "duration-500",
                "hover:border-[#0066FF]/70",

                isLarge &&
                  "w-[70vw] md:w-[48vw] h-[65vh]",

                isMedium &&
                  "w-[62vw] md:w-[40vw] h-[55vh]",

                isSmall &&
                  "w-[52vw] md:w-[30vw] h-[46vh]",
              )}
              style={{
                transformStyle:
                  "preserve-3d",
              }}
            >
              {/* =================================================
                  IMAGE / VIDEO
              ================================================= */}

              <div
                className={clsx(
                  "absolute",
                  "inset-0",
                  "overflow-hidden",
                )}
              >
                <img
                  ref={(element) => {
                    imageRefs.current[index] =
                      element;
                  }}
                  src={project.heroImage}
                  alt={project.title}
                  draggable={false}
                  className={clsx(
                    "horizontal-card-image",
                    "absolute",
                    "inset-[-5%]",
                    "w-[110%]",
                    "h-[110%]",
                    "object-cover",
                    "grayscale",
                    "contrast-110",
                    "brightness-[0.72]",
                    "will-change-transform",
                    "transform-gpu",
                  )}
                />

                {/* =================================================
                    PROJECT VIDEO
                ================================================= */}

                {project.heroVideo && (
                  <video
                    src={project.heroVideo}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={clsx(
                      "absolute",
                      "inset-0",
                      "w-full",
                      "h-full",
                      "object-cover",
                      "opacity-0",
                      "group-hover:opacity-100",
                      "transition-opacity",
                      "duration-700",
                    )}
                    onMouseEnter={(event) => {
                      event.currentTarget
                        .play()
                        .catch(() => {});
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.pause();
                    }}
                  />
                )}

                {/* =================================================
                    BOTTOM GRADIENT
                ================================================= */}

                <div
                  className={clsx(
                    "absolute",
                    "inset-0",
                    "bg-gradient-to-t",
                    "from-black",
                    "via-black/20",
                    "to-transparent",
                    "pointer-events-none",
                  )}
                />

                {/* =================================================
                    SIDE VIGNETTE
                ================================================= */}

                <div
                  className={clsx(
                    "absolute",
                    "inset-0",
                    "bg-gradient-to-r",
                    "from-black/30",
                    "via-transparent",
                    "to-black/40",
                    "pointer-events-none",
                  )}
                />

                {/* =================================================
                    BLUE ATMOSPHERE
                ================================================= */}

                <div
                  className={clsx(
                    "absolute",
                    "inset-0",
                    "bg-[#0066FF]/0",
                    "group-hover:bg-[#0066FF]/[0.04]",
                    "transition-colors",
                    "duration-700",
                    "pointer-events-none",
                  )}
                />

                {/* =================================================
                    SCANLINE
                ================================================= */}

                <div
                  className={clsx(
                    "absolute",
                    "left-0",
                    "right-0",
                    "top-1/2",
                    "h-px",
                    "bg-gradient-to-r",
                    "from-transparent",
                    "via-[#0066FF]/20",
                    "to-transparent",
                    "opacity-0",
                    "group-hover:opacity-100",
                    "group-hover:translate-y-[-80px]",
                    "transition-all",
                    "duration-1000",
                    "pointer-events-none",
                  )}
                />
              </div>

              {/* =================================================
                  TOP INFORMATION
              ================================================= */}

              <div
                className={clsx(
                  "absolute",
                  "top-5",
                  "left-5",
                  "right-5",
                  "flex",
                  "items-center",
                  "justify-between",
                  "z-10",
                  "pointer-events-none",
                )}
              >
                <span
                  className={clsx(
                    "font-mono",
                    "text-[9px]",
                    "md:text-[10px]",
                    "text-white/60",
                    "tracking-[0.3em]",
                  )}
                >
                  [
                  {String(
                    index + 1,
                  ).padStart(2, "0")}
                  ]
                </span>

                <span
                  className={clsx(
                    "font-mono",
                    "text-[8px]",
                    "md:text-[9px]",
                    "text-[#38BDF8]",
                    "tracking-[0.25em]",
                    "uppercase",
                    "text-right",
                    "max-w-[50%]",
                  )}
                >
                  {project.category}
                </span>
              </div>

              {/* =================================================
                  PROJECT TITLE
              ================================================= */}

              <div
                className={clsx(
                  "absolute",
                  "bottom-6",
                  "left-6",
                  "right-6",
                  "z-10",
                  "pointer-events-none",
                )}
              >
                <div
                  className={clsx(
                    "overflow-hidden",
                    "mb-2",
                  )}
                >
                  <span
                    className={clsx(
                      "font-mono",
                      "text-[9px]",
                      "text-[#00F0FF]",
                      "tracking-[0.3em]",
                      "uppercase",
                    )}
                  >
                    FRAME /{" "}
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={clsx(
                    "horizontal-card-title",
                    "font-sans",
                    "text-3xl",
                    "md:text-5xl",
                    "lg:text-6xl",
                    "font-medium",
                    "text-white",
                    "tracking-tight",
                    "leading-[0.9]",
                    "will-change-transform",
                  )}
                >
                  {project.title}
                </h3>

                {/* =================================================
                    CLIENT / DIRECTOR
                ================================================= */}

                <div
                  className={clsx(
                    "mt-3",
                    "max-w-lg",
                    "font-mono",
                    "text-[9px]",
                    "text-white/45",
                    "uppercase",
                    "tracking-widest",
                    "opacity-0",
                    "translate-y-2",
                    "group-hover:opacity-100",
                    "group-hover:translate-y-0",
                    "transition-all",
                    "duration-500",
                  )}
                >
                  {project.client}

                  {project.director && (
                    <>
                      {" // "}
                      {project.director}
                    </>
                  )}
                </div>

                {/* =================================================
                    BLUE ACCENT LINE
                ================================================= */}

                <div
                  className={clsx(
                    "horizontal-card-accent",
                    "origin-left",
                    "mt-4",
                    "w-20",
                    "h-px",
                    "bg-[#0066FF]",
                    "scale-x-0",
                    "shadow-[0_0_10px_rgba(0,102,255,0.7)]",
                  )}
                />
              </div>

              {/* =================================================
                  ARROW
              ================================================= */}

              <div
                className={clsx(
                  "absolute",
                  "right-5",
                  "bottom-5",
                  "z-20",
                  "w-10",
                  "h-10",
                  "border",
                  "border-white/20",
                  "bg-black/50",
                  "backdrop-blur-md",
                  "flex",
                  "items-center",
                  "justify-center",
                  "transition-all",
                  "duration-500",
                  "group-hover:bg-[#0066FF]",
                  "group-hover:border-[#0066FF]",
                  "group-hover:scale-110",
                )}
              >
                <ArrowUpRight
                  className={clsx(
                    "w-4",
                    "h-4",
                    "text-white",
                    "transition-transform",
                    "duration-500",
                    "group-hover:rotate-12",
                  )}
                />
              </div>

              {/* =================================================
                  FOOTER LABEL
              ================================================= */}

              <div
                className={clsx(
                  "absolute",
                  "left-5",
                  "bottom-5",
                  "font-mono",
                  "text-[8px]",
                  "text-white/30",
                  "tracking-[0.3em]",
                  "pointer-events-none",
                )}
              >
                {project.year} / IN / FRAME
              </div>

              {/* =================================================
                  HOVER BORDER
              ================================================= */}

              <div
                className={clsx(
                  "pointer-events-none",
                  "absolute",
                  "inset-0",
                  "border",
                  "border-transparent",
                  "group-hover:border-[#0066FF]/30",
                  "transition-colors",
                  "duration-500",
                )}
              />

              {/* =================================================
                  CORNER MARKS
              ================================================= */}

              <div className={clsx('absolute', 'top-0', 'left-0', 'w-5', 'h-px', 'bg-[#0066FF]/60', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')} />

              <div className={clsx('absolute', 'top-0', 'left-0', 'w-px', 'h-5', 'bg-[#0066FF]/60', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')} />

              <div className={clsx('absolute', 'bottom-0', 'right-0', 'w-5', 'h-px', 'bg-[#0066FF]/60', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')} />

              <div className={clsx('absolute', 'bottom-0', 'right-0', 'w-px', 'h-5', 'bg-[#0066FF]/60', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')} />
            </article>
          );
        })}

        {/* =====================================================
            END CARD
        ===================================================== */}

        <div
          className={clsx(
            "horizontal-end-archive",
            "flex-shrink-0",
            "w-[70vw]",
            "md:w-[55vw]",
            "h-[65vh]",
            "flex",
            "items-center",
            "justify-center",
          )}
        >
          <div className="text-center">
            <span
              className={clsx(
                "font-mono",
                "text-[10px]",
                "text-[#0066FF]",
                "tracking-[0.4em]",
                "uppercase",
              )}
            >
              {section('archive').archiveEnd}
            </span>

            <h2
              className={clsx(
                "mt-4",
                "text-white",
                "font-sans",
                "font-medium",
                "text-5xl",
                "md:text-8xl",
                "tracking-tight",
                "leading-none",
              )}
            >
              {section('archive').keepMoving.split(' ')[0]}
              <br />
              {section('archive').keepMoving.split(' ').slice(1).join(' ')}
              <span className="text-[#0066FF]">
                .
              </span>
            </h2>

            <div className={clsx('mx-auto', 'mt-8', 'w-16', 'h-px', 'bg-[#0066FF]')} />
          </div>
        </div>
      </div>

      {/* =====================================================
          SIDE LABEL
      ===================================================== */}

      <div
        ref={sideLabelRef}
        className={clsx(
          "absolute",
          "left-5",
          "bottom-8",
          "z-40",
          "hidden",
          "md:block",
        )}
      >
        <span
          className={clsx(
            "font-mono",
            "text-[9px]",
            "text-white/30",
            "tracking-[0.35em]",
            "uppercase",
          )}
          style={{
            writingMode: "vertical-rl",
          }}
        >
          {section('archive').archiveSide}
        </span>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div
        ref={scrollIndicatorRef}
        className={clsx(
          "absolute",
          "right-6",
          "bottom-8",
          "z-40",
        )}
      >
        <div
          className={clsx(
            "flex",
            "items-center",
            "gap-3",
            "font-mono",
            "text-[9px]",
            "text-white/50",
            "tracking-[0.25em]",
            "uppercase",
          )}
        >
          <span>SCROLL</span>

          <span
            className={clsx(
              "block",
              "w-12",
              "h-px",
              "bg-white/20",
              "relative",
              "overflow-hidden",
            )}
          >
            <span
              className={clsx(
                "absolute",
                "inset-y-0",
                "left-0",
                "w-full",
                "bg-[#0066FF]",
                "origin-left",
              )}
              ref={progressRef}
              style={{
                transform:
                  "scaleX(0)",
              }}
            />
          </span>

          <span>→</span>
        </div>
      </div>

      {/* =====================================================
          EDGE VIGNETTE
      ===================================================== */}

      <div
        className={clsx(
          "pointer-events-none",
          "absolute",
          "inset-0",
          "z-30",
          "bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]",
        )}
      />

      {/* =====================================================
          TOP / BOTTOM CINEMATIC FADE
      ===================================================== */}

      <div
        className={clsx(
          "pointer-events-none",
          "absolute",
          "top-0",
          "left-0",
          "right-0",
          "h-24",
          "z-20",
          "bg-gradient-to-b",
          "from-black",
          "to-transparent",
        )}
      />

      <div
        className={clsx(
          "pointer-events-none",
          "absolute",
          "bottom-0",
          "left-0",
          "right-0",
          "h-20",
          "z-20",
          "bg-gradient-to-t",
          "from-black",
          "to-transparent",
        )}
      />
    </section>
  );
};

export default HorizontalScrollCards;
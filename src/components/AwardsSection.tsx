import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { AWARDS_LIST, AWARDS_TOTAL, AWARDS_RANGE } from '../data/awards';
import { section, eyebrow } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

export const AwardsSection: React.FC = () => {
  // Awards come from src/data/awards.json, labels from sections.json → "awards"
  const t = section('awards');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const awards = awardsRef.current;

      if (!section || !heading || !awards) return;

      /* =========================================================
         ELEMENTS
      ========================================================= */

      const headingWords =
        gsap.utils.toArray<HTMLElement>('.heading-word');

      const rows =
        gsap.utils.toArray<HTMLElement>('.award-row');

      const lines =
        gsap.utils.toArray<HTMLElement>('.award-line');

      const numbers =
        gsap.utils.toArray<HTMLElement>('.award-number');

      const organizations =
        gsap.utils.toArray<HTMLElement>('.award-organization');

      const projects =
        gsap.utils.toArray<HTMLElement>('.award-project');

      const categories =
        gsap.utils.toArray<HTMLElement>('.award-category');

      /* =========================================================
         INITIAL STATES
      ========================================================= */

      gsap.set(headingWords, {
        yPercent: 120,
        opacity: 0,
      });

      gsap.set(rows, {
        y: 70,
        opacity: 0,
      });

      gsap.set(lines, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(numbers, {
        x: -25,
        opacity: 0,
      });

      gsap.set(organizations, {
        y: 20,
        opacity: 0,
      });

      gsap.set(projects, {
        y: 35,
        opacity: 0,
      });

      gsap.set(categories, {
        x: 35,
        opacity: 0,
        scale: 0.96,
      });

      /* =========================================================
         MAIN HEADING REVEAL
      ========================================================= */

      const headingReveal = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      headingReveal.to(headingWords, {
        yPercent: 0,
        opacity: 1,
        duration: 1.25,
        stagger: 0.08,
        ease: 'power4.out',
      });

      /* =========================================================
         HEADING PARALLAX
      ========================================================= */

      gsap.to(heading, {
        y: -45,
        ease: 'none',

        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      /* =========================================================
         AWARD ROW REVEAL
      ========================================================= */

      gsap.to(rows, {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.out',

        scrollTrigger: {
          trigger: awards,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         DIVIDER LINE ANIMATION
      ========================================================= */

      gsap.to(lines, {
        scaleX: 1,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power3.inOut',

        scrollTrigger: {
          trigger: awards,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         INDEX NUMBERS
      ========================================================= */

      gsap.to(numbers, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: awards,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         ORGANIZATION NAMES
      ========================================================= */

      gsap.to(organizations, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.13,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: awards,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         PROJECT NAMES
      ========================================================= */

      gsap.to(projects, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',

        scrollTrigger: {
          trigger: awards,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         CATEGORY TAGS
      ========================================================= */

      gsap.to(categories, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: awards,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      /* =========================================================
         ROW HOVER EFFECTS
      ========================================================= */

      rows.forEach((row) => {
        const project =
          row.querySelector<HTMLElement>('.award-project');

        const category =
          row.querySelector<HTMLElement>('.award-category');

        const number =
          row.querySelector<HTMLElement>('.award-number');

        const organization =
          row.querySelector<HTMLElement>('.award-organization');

        if (
          !project ||
          !category ||
          !number ||
          !organization
        ) {
          return;
        }

        row.addEventListener('mouseenter', () => {
          gsap.to(project, {
            x: 14,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(organization, {
            x: 5,
            opacity: 1,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(category, {
            x: -8,
            scale: 1.02,
            borderColor: 'rgba(0, 102, 255, 0.6)',
            backgroundColor: 'rgba(0, 102, 255, 0.06)',
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(number, {
            x: 8,
            color: '#0066FF',
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        });

        row.addEventListener('mouseleave', () => {
          gsap.to(project, {
            x: 0,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(organization, {
            x: 0,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(category, {
            x: 0,
            scale: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(number, {
            x: 0,
            color: 'rgba(255,255,255,0.25)',
            duration: 0.35,
            ease: 'power3.out',
            overwrite: true,
          });
        });
      });

      /* =========================================================
         SECTION PARALLAX DETAILS
      ========================================================= */

      const backgroundGlow =
        section.querySelector<HTMLElement>('.award-glow');

      const leftGuide =
        section.querySelector<HTMLElement>('.award-guide-left');

      const rightGuide =
        section.querySelector<HTMLElement>('.award-guide-right');

      if (backgroundGlow) {
        gsap.to(backgroundGlow, {
          y: -80,
          scale: 1.15,
          ease: 'none',

          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      if (leftGuide) {
        gsap.to(leftGuide, {
          y: -60,
          ease: 'none',

          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      if (rightGuide) {
        gsap.to(rightGuide, {
          y: 60,
          ease: 'none',

          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      /* =========================================================
         REFRESH
      ========================================================= */

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={clsx(
        'relative',
        'py-24',
        'md:py-36',
        'bg-black',
        'border-t',
        'border-white/10',
        'select-none',
        'overflow-hidden'
      )}
    >
      {/* =====================================================
          BACKGROUND DETAILS
      ===================================================== */}

      <div
        className={clsx(
          'absolute',
          'inset-0',
          'pointer-events-none',
          'overflow-hidden'
        )}
      >
        {/* Left vertical guide */}

        <div
          className={clsx(
            'award-guide-left',
            'absolute',
            'left-[8%]',
            'top-[15%]',
            'w-px',
            'h-[70%]',
            'bg-white/[0.04]',
            'will-change-transform'
          )}
        />

        {/* Right vertical guide */}

        <div
          className={clsx(
            'award-guide-right',
            'absolute',
            'right-[8%]',
            'top-[10%]',
            'w-px',
            'h-[80%]',
            'bg-white/[0.04]',
            'will-change-transform'
          )}
        />

        {/* Center glow */}

        <div
          className={clsx(
            'award-glow',
            'absolute',
            'left-1/2',
            'top-1/2',
            '-translate-x-1/2',
            '-translate-y-1/2',
            'w-[500px]',
            'h-[500px]',
            'rounded-full',
            'bg-red-500/[0.025]',
            'blur-[120px]',
            'will-change-transform'
          )}
        />

        {/* Subtle horizontal grid */}

        <div
          className={clsx(
            'absolute',
            'left-0',
            'right-0',
            'top-1/3',
            'h-px',
            'bg-white/[0.025]'
          )}
        />

        <div
          className={clsx(
            'absolute',
            'left-0',
            'right-0',
            'bottom-1/4',
            'h-px',
            'bg-white/[0.025]'
          )}
        />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className={clsx(
          'relative',
          'max-w-[1440px]',
          'mx-auto',
          'px-6',
          'md:px-12'
        )}
      >
        {/* =====================================================
            SECTION LABEL
        ===================================================== */}

        <div
          className={clsx(
            'flex',
            'items-center',
            'justify-between',
            'mb-10',
            'font-mono',
            'text-[9px]',
            'md:text-[10px]',
            'tracking-[0.3em]',
            'uppercase',
            'text-white/35'
          )}
        >
          <span>{eyebrow('awards')}</span>

          <span className={clsx('hidden', 'sm:block')}>
            {t.eyebrowRight}
          </span>
        </div>

        {/* =====================================================
            HEADING
        ===================================================== */}

        <div
          className={clsx(
            'relative',
            'overflow-hidden',
            'mb-16',
            'md:mb-20',
            'py-3'
          )}
        >
          <h2
            ref={headingRef}
            className={clsx(
              'font-sans',
              'font-medium',
              'text-white',
              'tracking-[-0.055em]',
              'uppercase',
              'leading-[0.92]',
              'text-center',
              'will-change-transform',
              'text-[clamp(3rem,8vw,8rem)]'
            )}
          >
            <span className={clsx('heading-line', 'block', 'overflow-hidden')}>
              <span className={clsx('heading-word', 'inline-block')}>
                {t.titleWord1}
              </span>

              <span className={clsx('heading-word', 'inline-block', 'text-white/20', 'ml-3', 'md:ml-5')}>
                &
              </span>

              <span className={clsx('heading-word', 'inline-block', 'ml-3', 'md:ml-5')}>
                {t.titleWord2}
              </span>
            </span>
          </h2>
        </div>

        {/* =====================================================
            AWARDS
        ===================================================== */}

        <div
          ref={awardsRef}
          className={clsx(
            'max-w-5xl',
            'mx-auto'
          )}
        >
          {AWARDS_LIST.map((item, idx) => (
            <div
              key={idx}
              className={clsx(
                'award-row',
                'relative',
                'group',
                'py-7',
                'md:py-9',
                'cursor-default',
                'will-change-transform'
              )}
            >
              {/* TOP LINE */}

              <div
                className={clsx(
                  'award-line',
                  'absolute',
                  'top-0',
                  'left-0',
                  'right-0',
                  'h-px',
                  'bg-white/10'
                )}
              />

              <div
                className={clsx(
                  'flex',
                  'flex-col',
                  'md:flex-row',
                  'md:items-center',
                  'gap-5',
                  'md:gap-8'
                )}
              >
                {/* INDEX */}

                <div
                  className={clsx(
                    'award-number',
                    'w-10',
                    'shrink-0',
                    'font-mono',
                    'text-[10px]',
                    'tracking-[0.2em]',
                    'text-white/25',
                    'will-change-transform'
                  )}
                >
                  [{String(idx + 1).padStart(2, '0')}]
                </div>

                {/* MAIN CONTENT */}

                <div className={clsx('flex-1', 'min-w-0')}>
                  {/* ORGANIZATION */}

                  <span
                    className={clsx(
                      'award-organization',
                      'block',
                      'font-mono',
                      'text-[9px]',
                      'md:text-[10px]',
                      'text-white/40',
                      'tracking-[0.22em]',
                      'uppercase',
                      'mb-2',
                      'will-change-transform'
                    )}
                  >
                    {item.organization}
                  </span>

                  {/* PROJECT */}

                  <h3
                    className={clsx(
                      'award-project',
                      'font-sans',
                      'text-2xl',
                      'md:text-4xl',
                      'text-white',
                      'font-medium',
                      'tracking-[-0.025em]',
                      'leading-none',
                      'will-change-transform'
                    )}
                  >
                    {item.project}
                  </h3>
                </div>

                {/* CATEGORY */}

                <div
                  className={clsx(
                    'award-category',
                    'shrink-0',
                    'font-mono',
                    'text-[9px]',
                    'md:text-[10px]',
                    'text-[#0066FF]',
                    'tracking-[0.12em]',
                    'uppercase',
                    'px-4',
                    'py-2.5',
                    'border',
                    'border-white/10',
                    'bg-white/[0.03]',
                    'will-change-transform'
                  )}
                >
                  {item.category}
                </div>
              </div>

              {/* HOVER LINE */}

              <div
                className={clsx(
                  'absolute',
                  'bottom-0',
                  'left-0',
                  'h-px',
                  'w-0',
                  'bg-[#0066FF]',
                  'group-hover:w-full',
                  'transition-all',
                  'duration-700',
                  'ease-out'
                )}
              />

              {/* SIDE ACCENT */}

              <div
                className={clsx(
                  'absolute',
                  'left-[-20px]',
                  'top-1/2',
                  '-translate-y-1/2',
                  'w-[2px]',
                  'h-0',
                  'bg-[#0066FF]',
                  'group-hover:h-8',
                  'transition-all',
                  'duration-500',
                  'ease-out'
                )}
              />

              {/* HOVER GLOW */}

              <div
                className={clsx(
                  'absolute',
                  'inset-0',
                  'pointer-events-none',
                  'opacity-0',
                  'group-hover:opacity-100',
                  'transition-opacity',
                  'duration-500',
                  'bg-gradient-to-r',
                  'from-blue-500/[0.025]',
                  'via-transparent',
                  'to-transparent'
                )}
              />
            </div>
          ))}

          {/* FINAL LINE */}

          <div
            className={clsx(
              'award-line',
              'h-px',
              'bg-white/10'
            )}
          />
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className={clsx(
            'flex',
            'items-center',
            'justify-between',
            'mt-12',
            'font-mono',
            'text-[9px]',
            'tracking-[0.25em]',
            'uppercase',
            'text-white/30'
          )}
        >
          <span>
            {t.footerLabel} / {AWARDS_RANGE}
          </span>

          <span className="text-[#0066FF]">
            {String(AWARDS_LIST.length).padStart(2, '0')} OF {AWARDS_TOTAL} AWARDS
          </span>
        </div>
      </div>
    </section>
  );
};
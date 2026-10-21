import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';
import { PROCESS_DATA } from '../data/process';
import { section } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

// Stages come from src/data/process.json
const STAGES = PROCESS_DATA.map((s) => ({
  index: s.step,
  name: s.title,
  tagline: s.summary,
}));

const pad2 = (n: number) => String(n).padStart(2, '0');

export const ProductionProcess: React.FC = () => {
  // Labels come from sections.json → "process"
  const t = section('process');
  const sectionRef = useRef<HTMLElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const stageNumberRef = useRef<HTMLSpanElement>(null);
  const stageNameRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const stages = stageRefs.current.filter(
        (stage): stage is HTMLDivElement => stage !== null
      );

      /*
       * Initial state
       *
       * Only the first stage is visible.
       * All other stages are positioned below the viewport.
       */
      gsap.set(stages, {
        yPercent: 100,
        opacity: 0,
        scale: 0.96,
        filter: 'blur(8px)',
      });

      gsap.set(stages[0], {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      });

      /*
       * Timeline
       *
       * Every stage gets a clean entrance and exit.
       * There are NO overlapping ghost titles.
       */
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.inOut',
        },
      });

      STAGES.forEach((_, index) => {
        if (index === 0) return;

        const previous = stages[index - 1];
        const current = stages[index];

        /*
         * Previous stage leaves upward.
         */
        timeline.to(
          previous,
          {
            yPercent: -100,
            opacity: 0,
            scale: 0.94,
            filter: 'blur(10px)',
            duration: 1,
          },
          '>'
        );

        /*
         * New stage enters from below.
         */
        timeline.fromTo(
          current,
          {
            yPercent: 100,
            opacity: 0,
            scale: 0.96,
            filter: 'blur(10px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
          },
          '<'
        );

        /*
         * Update stage metadata.
         */
        timeline.call(
          () => {
            if (stageNumberRef.current) {
              stageNumberRef.current.textContent = `[ ${t.stageLabel} ${pad2(index + 1)} OF ${pad2(STAGES.length)} ]`;
            }

            if (stageNameRef.current) {
              stageNameRef.current.textContent = STAGES[index].name;
            }
          },
          [],
          '>'
        );
      });

      /*
       * ScrollTrigger
       *
       * 520vh gives enough vertical travel for the cinematic
       * transitions without creating unnecessary dead space.
       */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: false,
        scrub: 1.2,

        animation: timeline,

        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }

          const totalStages = STAGES.length;

          const stageIndex = Math.min(
            Math.floor(self.progress * totalStages),
            totalStages - 1
          );

          if (stageNumberRef.current) {
            stageNumberRef.current.textContent = `[ ${t.stageLabel} ${pad2(stageIndex + 1)} OF ${pad2(STAGES.length)} ]`;
          }

          if (stageNameRef.current) {
            stageNameRef.current.textContent = STAGES[stageIndex].name;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={clsx('relative', 'bg-[#000000]', 'border-t', 'border-white/10')}
      style={{ height: `${STAGES.length * 130}vh` }}
    >
      {/*
       * Sticky cinematic viewport
       */}
      <div className={clsx('sticky', 'top-0', 'h-[100svh]', 'min-h-[650px]', 'w-full', 'overflow-hidden', 'bg-[#000000]')}>
        {/*
         * Subtle top border
         */}
        <div className={clsx('absolute', 'top-0', 'left-0', 'right-0', 'h-px', 'bg-white/10')} />

        {/*
         * LEFT VERTICAL LABEL
         */}
        <div
          className={clsx('absolute', 'left-6', 'md:left-10', 'top-1/2', '-translate-y-1/2', 'hidden', 'md:block', 'pointer-events-none')}
        >
          <div
            className={clsx('font-mono', 'text-[9px]', 'tracking-[0.35em]', 'text-white/30', 'uppercase', '[writing-mode:vertical-rl]', 'rotate-180')}
          >
            {t.sideLabel}
          </div>
        </div>

        {/*
         * TOP INFORMATION BAR
         */}
        <div
          className={clsx('absolute', 'top-0', 'left-0', 'right-0', 'z-30', 'px-6', 'md:px-16', 'pt-7', 'md:pt-10')}
        >
          <div className={clsx('flex', 'items-center', 'justify-between')}>
            <span
              ref={stageNumberRef}
              className={clsx('font-mono', 'text-[10px]', 'md:text-xs', 'tracking-[0.25em]', 'text-white/60', 'uppercase')}
            >
              [ {t.stageLabel} 01 OF {pad2(STAGES.length)} ]
            </span>

            <span
              ref={stageNameRef}
              className={clsx('font-mono', 'text-[10px]', 'md:text-xs', 'tracking-[0.2em]', 'text-[#00F0FF]', 'font-bold', 'uppercase')}
            >
              {STAGES[0].name}
            </span>
          </div>
        </div>

        {/*
         * MAIN STAGE AREA
         */}
        <div
          className={clsx('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'px-6', 'md:px-20')}
        >
          <div
            className={clsx('relative', 'w-full', 'max-w-[1400px]', 'h-[55vh]', 'md:h-[60vh]')}
          >
            {STAGES.map((stage, index) => (
              <div
                key={stage.index}
                ref={(element) => {
                  stageRefs.current[index] = element;
                }}
                className={clsx('absolute', 'inset-0', 'flex', 'flex-col', 'items-center', 'justify-center', 'text-center', 'will-change-transform')}
              >
                {/*
                 * Stage number
                 */}
                <div
                  className={clsx('mb-7', 'md:mb-10', 'font-mono', 'text-base', 'md:text-xl', 'tracking-[0.2em]', 'text-[#6366F1]', 'font-bold')}
                >
                  [{stage.index}]
                </div>

                {/*
                 * Main title
                 *
                 * clamp prevents the huge title from becoming
                 * impossible to control on smaller screens.
                 */}
                <h2
                  className={clsx('font-sans', 'font-bold', 'text-white', 'uppercase', 'tracking-[-0.055em]', 'leading-[0.82]', 'whitespace-nowrap')}
                  style={{
                    fontSize: 'clamp(3.4rem, 10vw, 10rem)',
                  }}
                >
                  {stage.name}
                </h2>

                {/*
                 * Divider
                 */}
                <div
                  className={clsx('mt-8', 'md:mt-10', 'h-px', 'w-20', 'md:w-28', 'bg-white/20')}
                />

                {/*
                 * Description
                 */}
                <p
                  className={clsx('mt-7', 'md:mt-9', 'max-w-[680px]', 'font-mono', 'text-[9px]', 'md:text-[11px]', 'leading-[1.8]', 'tracking-[0.13em]', 'text-white/55', 'uppercase')}
                >
                  {stage.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*
         * BOTTOM INFORMATION
         */}
        <div
          className={clsx('absolute', 'bottom-0', 'left-0', 'right-0', 'z-30', 'px-6', 'md:px-16', 'pb-6', 'md:pb-8')}
        >
          <div
            className={clsx('border-t', 'border-white/10', 'pt-4', 'md:pt-5', 'flex', 'flex-col', 'md:flex-row', 'items-start', 'md:items-center', 'justify-between', 'gap-4')}
          >
            <span
              className={clsx('font-mono', 'text-[9px]', 'md:text-[10px]', 'tracking-[0.2em]', 'text-white/40', 'uppercase')}
            >
              {t.footerLeft}
            </span>

            <span
              className={clsx('font-mono', 'text-[9px]', 'md:text-[10px]', 'tracking-[0.2em]', 'text-white/40', 'uppercase')}
            >
              {t.footerMid}
            </span>

            <span
              className={clsx('font-mono', 'text-[9px]', 'md:text-[10px]', 'tracking-[0.2em]', 'text-white/40', 'uppercase')}
            >
              {t.footerRight}
            </span>
          </div>

          {/*
           * Cinematic progress line
           */}
          <div className={clsx('relative', 'mt-4', 'h-px', 'w-full', 'bg-white/10', 'overflow-hidden')}>
            <div
              ref={progressRef}
              className={clsx('absolute', 'inset-y-0', 'left-0', 'w-full', 'origin-left', 'scale-x-0', 'bg-gradient-to-r', 'from-[#0052FF]', 'via-[#0EA5E9]', 'to-[#00F0FF]')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductionProcess;
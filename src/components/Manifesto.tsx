import React from "react";
import { ArrowUpRight } from "lucide-react";
import { soundEngine } from "../utils/audioSynth";
import clsx from "clsx";
import { SITE, section } from "../data/site";

interface ManifestoProps {
  onOpenInquiry?: () => void;
}

export const Manifesto: React.FC<ManifestoProps> = ({
  onOpenInquiry,
}) => {
  // All copy comes from src/data/sections.json → "manifesto"
  const t = section('manifesto');

  return (
    <section
      className={clsx('relative', 'bg-black', 'text-white', 'border-t', 'border-white/10', 'py-16', 'md:py-20', 'select-none')}
    >
      <div
        className={clsx('mx-auto', 'max-w-[1440px]', 'px-6', 'md:px-12')}
      >
        {/* =================================================
            TOP POSITIONING
        ================================================== */}

        <div
          className={clsx('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-10', 'md:gap-16', 'border-b', 'border-white/10', 'pb-10', 'md:pb-12', 'mb-14', 'md:mb-16')}
        >
          {/* LEFT */}

          <div>
            <span
              className={clsx('mb-3', 'block', 'font-mono', 'text-[9px]', 'md:text-[10px]', 'uppercase', 'tracking-[0.2em]', 'text-white/40')}
            >
              {t.leftEyebrow}
            </span>

            <h2
              className={clsx('font-sans', 'text-xl', 'md:text-3xl', 'font-medium', 'leading-[1.05]', 'tracking-tight', 'text-white')}
            >
              {t.leftTitle[0]}
              <br />
              {t.leftTitle[1]}
            </h2>
          </div>

          {/* RIGHT */}

          <div>
            <span
              className={clsx('mb-3', 'block', 'font-mono', 'text-[9px]', 'md:text-[10px]', 'uppercase', 'tracking-[0.2em]', 'font-bold', 'text-[#0066FF]')}
            >
              {t.rightEyebrow}
            </span>

            <h2
              className={clsx('font-sans', 'text-xl', 'md:text-3xl', 'font-medium', 'leading-[1.05]', 'tracking-tight', 'uppercase', 'text-white/90')}
            >
              {t.rightTitle[0]}
              <br />
              {t.rightTitle[1]}
            </h2>
          </div>
        </div>

        {/* =================================================
            THREE COLUMNS
        ================================================== */}

        <div
          className={clsx('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-10', 'md:gap-12', 'mb-16', 'md:mb-20')}
        >
          {t.columns.map((col: { title: string; accent: boolean; body: string }, i: number) => (
            <div key={i}>
              <h3
                className={clsx('mb-3', col.accent ? 'font-mono' : 'font-sans', 'text-base', 'md:text-lg', 'font-bold', 'uppercase', 'tracking-tight', col.accent && 'text-[#0066FF]')}
              >
                {col.title}
              </h3>

              <p
                className={clsx('max-w-sm', 'font-sans', 'text-sm', 'font-light', 'leading-relaxed', 'text-white/60')}
              >
                {col.body}
              </p>
            </div>
          ))}
        </div>

        {/* =================================================
            GIANT STATEMENT
        ================================================== */}

        <div
          className={clsx('mx-auto', 'max-w-6xl', 'text-center')}
        >
          <h2
            className={clsx('font-sans', 'text-[13vw]', 'sm:text-7xl', 'md:text-[7.5rem]', 'lg:text-[8rem]', 'font-bold', 'uppercase', 'leading-[0.82]', 'tracking-[-0.05em]')}
          >
            {t.giantLine}
            <br />

            <span className="text-[#0066FF]">
              {t.giantAccent}
            </span>
          </h2>

          {/* CTA */}

          <div className={clsx('mt-10', 'md:mt-12')}>
            <button
              type="button"
              onClick={() => {
                soundEngine.playShutter();

                onOpenInquiry?.();
              }}
              className={clsx('cta-btn', 'group', 'inline-flex', 'items-center', 'gap-4', 'px-7', 'py-4', 'md:px-9', 'md:py-5', 'text-sm', 'md:text-base', 'shadow-2xl')}
            >
              <span>
                {SITE.cta.manifesto}
              </span>

              <span
                className={clsx('cta-btn-arrow', 'flex', 'h-6', 'w-6', 'items-center', 'justify-center')}
              >
                <ArrowUpRight
                  className={clsx('h-4', 'w-4', 'text-white')}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
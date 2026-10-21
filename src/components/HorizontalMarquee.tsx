import React from 'react';

interface MarqueeItem {
  text: string;
  type: 'brand' | 'discipline';
}

const TOP_ITEMS: MarqueeItem[] = [
  { text: 'CINEMATIC DIRECTION', type: 'discipline' },
  { text: 'MERCEDES-BENZ', type: 'brand' },
  { text: 'LARGE FORMAT OPTICS', type: 'discipline' },
  { text: 'NETFLIX', type: 'brand' },
  { text: 'DOLBY ATMOS SOUND', type: 'discipline' },
  { text: 'PORSCHE', type: 'brand' },
  { text: 'VIRTUAL PRODUCTION', type: 'discipline' },
  { text: 'CHANEL', type: 'brand' },
  { text: 'COLOR GRADING ACES', type: 'discipline' },
  { text: 'APPLE', type: 'brand' },
  { text: 'VFX & 3D WORLDS', type: 'discipline' },
  { text: 'RED BULL', type: 'brand' },
];

const BOTTOM_ITEMS: MarqueeItem[] = [
  { text: '4K RAW ACQUISITION', type: 'discipline' },
  { text: 'DIOR', type: 'brand' },
  { text: 'ANAMORPHIC LENSES', type: 'discipline' },
  { text: 'SONY PICTURES', type: 'brand' },
  { text: 'HIGH-SPEED 1000FPS', type: 'discipline' },
  { text: 'BMW GROUP', type: 'brand' },
  { text: 'SPATIAL AUDIO DESIGN', type: 'discipline' },
  { text: 'AMAZON PRIME', type: 'brand' },
  { text: 'DRONE CINEMATOGRAPHY', type: 'discipline' },
  { text: 'DISNEY+', type: 'brand' },
  { text: 'PHANTOM FLEX 4K', type: 'discipline' },
  { text: 'VOGUE', type: 'brand' },
];

export const HorizontalMarquee: React.FC = () => (
  <div className="bg-[#050505] section-divider py-6 overflow-hidden select-none">
    {/* Row 1 — scrolls left */}
    <div className="flex overflow-hidden mb-2">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {[...TOP_ITEMS, ...TOP_ITEMS].map((item, i) => (
          <React.Fragment key={i}>
            <span
              className={`font-condensed-hero text-2xl md:text-3xl tracking-wide mx-5 ${
                item.type === 'brand' ? 'text-[#F5F5F7]/25' : 'text-[#FFB800]/30'
              } hover:text-[#FFB800] transition-colors duration-300`}
            >
              {item.text}
            </span>
            <span className="text-[#9E9EA4]/20 mx-3">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Row 2 — scrolls right (slower) */}
    <div className="flex overflow-hidden">
      <div className="animate-marquee-r flex items-center whitespace-nowrap">
        {[...BOTTOM_ITEMS, ...BOTTOM_ITEMS].map((item, i) => (
          <React.Fragment key={i}>
            <span
              className={`font-mono text-[10px] tracking-[0.25em] uppercase mx-6 ${
                item.type === 'brand' ? 'text-[#9E9EA4]/25' : 'text-[#FFB800]/20'
              } hover:text-[#FFB800] transition-colors duration-300`}
            >
              {item.text}
            </span>
            <span className="text-[#9E9EA4]/15 mx-3">—</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

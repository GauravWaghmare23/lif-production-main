/**
 * Site-wide content helpers.
 *  - site.json      → brand, nav, socials, footer
 *  - sections.json  → page ORDER + every section's text labels
 *  - inquiry.json   → "Commission Brief" modal
 */
import siteRaw from '../content/site.json';
import sectionsRaw from '../content/sections.json';
import inquiryRaw from '../content/inquiry.json';

export const SITE = siteRaw;
export const INQUIRY = inquiryRaw;

export const SECTION_ORDER: string[] = sectionsRaw.order;
export const SECTIONS = sectionsRaw.items as Record<string, any>;

/** Typed accessor so components can do `const t = section('work')`. */
export const section = (id: string): any => SECTIONS[id] ?? {};

/** Automatic 01, 02, 03… numbering based on the order in sections.json. */
export const sectionNumber = (id: string): string => {
  let n = 0;
  for (const key of SECTION_ORDER) {
    if (SECTIONS[key]?.numbered) n += 1;
    if (key === id) return String(n).padStart(2, '0');
  }
  return '00';
};

/** "03 // SELECTED WORK" */
export const eyebrow = (id: string): string =>
  `${sectionNumber(id)} // ${section(id).eyebrow ?? ''}`;

/** Default scroll target for a section id (wrapper added in App.tsx). */
export const sectionDomId = (id: string): string => `sec-${id}`;

export const scrollToSection = (target: string) => {
  const el =
    document.getElementById(target) ??
    document.getElementById(sectionDomId(target));
  el?.scrollIntoView({ behavior: 'smooth' });
};

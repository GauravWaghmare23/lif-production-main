import raw from '../content/awards.json';
import projectsRaw from '../content/projects.json';

export interface AwardItem {
  slug: string;
  year: string;
  organization: string;
  category: string;
  honor: string;
  project: string;
}

const titleBySlug = new Map<string, string>(
  (projectsRaw.projects as { slug: string; title: string }[]).map((p) => [p.slug, p.title])
);

export const AWARDS_TOTAL: number = raw.total;

export const AWARDS_LIST: AwardItem[] = raw.items.map((a) => ({
  ...a,
  project: titleBySlug.get(a.slug) ?? a.slug.toUpperCase(),
}));

export const AWARDS_BY_SLUG: Record<string, AwardItem> = Object.fromEntries(
  AWARDS_LIST.map((a) => [a.slug, a])
);

/** "2025—2026" style range derived from the list. */
export const AWARDS_RANGE: string = (() => {
  const years = AWARDS_LIST.map((a) => Number(a.year)).filter(Boolean);
  if (!years.length) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}—${max}`;
})();

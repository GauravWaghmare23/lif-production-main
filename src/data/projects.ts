import type { Project } from '../types';
import raw from '../content/projects.json';
import { resolveVideo } from './videos';
import { AWARDS_BY_SLUG } from './awards';

/**
 * Projects — data lives in projects.json.
 * heroVideo is resolved from the video library key, and the
 * "awards" metric is pulled from awards.json so it is never duplicated.
 */
export const PROJECTS_DATA: Project[] = (raw.projects as any[]).map((p) => ({
  ...p,
  heroVideo: resolveVideo(p.video),
  metrics: {
    ...p.metrics,
    awards: AWARDS_BY_SLUG[p.slug]?.honor,
  },
})) as Project[];

/** "2025—2026" style range derived from the projects. */
export const PROJECTS_YEAR_RANGE: string = (() => {
  const years = PROJECTS_DATA.map((p) => Number(p.year)).filter(Boolean);
  if (!years.length) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}—${max}`;
})();

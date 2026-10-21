import brandsRaw from '../content/brands.json';
import statsRaw from '../content/stats.json';

export interface ClientLogo {
  name: string;
  category: string;
  year: string;
}

export interface StatItem {
  code: string;
  number: string;
  label: string;
  highlight: boolean;
  photo: string;
}

/** Clients — data lives in brands.json (single source for every client list). */
export const CLIENTS_DATA: ClientLogo[] = brandsRaw.brands;

/** "By the numbers" cards — data lives in stats.json. */
export const STATS_DATA: StatItem[] = statsRaw.stats;

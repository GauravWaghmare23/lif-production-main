import raw from '../content/services.json';
import { resolveVideo } from './videos';

export interface ServiceData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  videoUrl: string;
}

/** Services — data lives in services.json. Numbers are generated from the order. */
export const SERVICES_DATA: ServiceData[] = raw.services.map((s, i) => ({
  id: String(i + 1).padStart(2, '0'),
  number: String(i + 1).padStart(2, '0'),
  title: s.title,
  subtitle: s.subtitle,
  description: s.description,
  tags: s.tags,
  videoUrl: resolveVideo(s.video),
}));

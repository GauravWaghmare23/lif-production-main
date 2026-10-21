import raw from '../content/process.json';

export interface ProcessStageData {
  step: string;
  title: string;
  summary: string;
  tagline: string;
  description: string;
  deliverables: string[];
  gear: string;
  visual: string;
  schematic: string[];
}

/** Production process — data lives in process.json. */
export const PROCESS_DATA: ProcessStageData[] = raw.stages;

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'FILM' | 'COMMERCIAL' | 'MUSIC VIDEO' | 'DOCUMENTARY' | 'VFX & 3D';
  year: string;
  client: string;
  director: string;
  cinematographer: string;
  camera: string;
  aspectRatio: string;
  duration: string;
  description: string;
  heroImage: string;
  heroVideo?: string;
  stills: {
    url: string;
    caption: string;
    frameNo: string;
  }[];
  storyboards?: {
    url: string;
    step: string;
    note: string;
  }[];
  theIdea: string;
  theFrame: string;
  theProcess: string;
  theFinalCut: string;
  metrics?: {
    views?: string;
    awards?: string;
    resolution?: string;
  };
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  backdropImage: string;
  accentColor?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  portrait: string;
  bio: string;
  credits: string[];
}

export interface ProcessStage {
  step: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  gear: string;
  visual: string;
  schematic: string[];
}

export interface InquiryFormData {
  projectType: string;
  services: string[];
  budget: number;
  timeline: string;
  description: string;
  name: string;
  email: string;
  company: string;
}

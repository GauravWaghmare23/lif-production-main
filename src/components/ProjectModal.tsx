import React, { useEffect } from 'react';
import type { Project } from '../types';
import { PROJECTS_DATA } from '../data/projects';
import { soundEngine } from '../utils/audioSynth';
import { section } from '../data/site';
import { X, ArrowRight, Camera, Award } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProject
}) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playLensTick(0.8);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  // Labels come from sections.json → "modal"
  const m = section('modal');

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

  const handleNext = () => {
    soundEngine.playShutter();
    soundEngine.playWhoosh();
    onSelectProject(nextProject);
    const container = document.getElementById('project-modal-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      id="project-modal-container"
      className="fixed inset-0 z-[9000] bg-[#050505] overflow-y-auto overflow-x-hidden text-warm-white animate-fadeIn"
    >
      {/* Sticky Header for Modal */}
      <div className="sticky top-0 left-0 w-full z-30 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 font-mono text-xs text-cine-muted">
          <span className="text-cine-gold font-bold">FRAME 0{project.id}</span>
          <span>//</span>
          <span className="text-warm-white uppercase tracking-wider">{project.title}</span>
        </div>

        <button
          onClick={() => {
            soundEngine.playLensTick(0.8);
            onClose();
          }}
          data-cursor="CLOSE"
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-cine-gold hover:text-black text-warm-white rounded-sm font-mono text-xs tracking-widest uppercase transition-all duration-300 font-bold"
        >
          <X className="w-4 h-4" />
          <span>{m.close}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        {/* Project Header Info */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-cine-muted uppercase tracking-widest mb-4">
            <span className="bg-gradient-to-r from-cine-orange to-cine-gold text-black font-black px-3 py-1 rounded shadow-md">
              {project.category}
            </span>
            <span>YEAR: {project.year}</span>
            <span>•</span>
            <span>CLIENT: {project.client}</span>
            <span>•</span>
            <span>DURATION: {project.duration}</span>
          </div>

          <h1 className="font-condensed-hero text-6xl sm:text-8xl md:text-9xl text-warm-white tracking-tight leading-none mb-6">
            {project.title}
          </h1>

          <p className="font-sans text-xl md:text-2xl text-cine-muted font-light leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Hero Media Plate */}
        <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-cine-gold/30 bg-black mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
          {project.heroVideo ? (
            <video
              src={project.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-0 left-0 right-0 h-[5%] bg-black pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[5%] bg-black pointer-events-none" />
        </div>

        {/* Technical Production Dossier Grid */}
        <div className="p-8 bg-[#0b0b0e] border border-cine-gold/25 rounded-sm mb-20 shadow-2xl">
          <h3 className="font-mono text-xs text-cine-gold tracking-widest uppercase mb-6 flex items-center space-x-2 font-bold">
            <Camera className="w-4 h-4" />
            <span>{m.specsTitle}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 font-mono text-xs">
            <div>
              <p className="text-cine-muted uppercase mb-1">{m.director}</p>
              <p className="text-warm-white font-bold">{project.director}</p>
            </div>
            <div>
              <p className="text-cine-muted uppercase mb-1">{m.cinematography}</p>
              <p className="text-warm-white font-bold">{project.cinematographer}</p>
            </div>
            <div>
              <p className="text-cine-muted uppercase mb-1">{m.camera}</p>
              <p className="text-cine-gold font-bold">{project.camera}</p>
            </div>
            <div>
              <p className="text-cine-muted uppercase mb-1">{m.aspect}</p>
              <p className="text-warm-white font-bold">{project.aspectRatio}</p>
            </div>
            {project.metrics?.awards && (
              <div className="col-span-2 sm:col-span-3 md:col-span-2">
                <p className="text-cine-muted uppercase mb-1">{m.honors}</p>
                <p className="text-cine-gold font-bold flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>{project.metrics.awards}</span>
                </p>
              </div>
            )}
            {project.metrics?.resolution && (
              <div>
                <p className="text-cine-muted uppercase mb-1">{m.format}</p>
                <p className="text-warm-white font-bold">{project.metrics.resolution}</p>
              </div>
            )}
          </div>
        </div>

        {/* 4 Narrative Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-cine-gold tracking-widest uppercase font-bold">
              {m.chapters[0].eyebrow}
            </h4>
            <h3 className="font-display text-2xl font-bold text-warm-white">
              {m.chapters[0].title}
            </h3>
            <p className="font-sans text-cine-muted leading-relaxed">
              {project.theIdea}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-cine-gold tracking-widest uppercase font-bold">
              {m.chapters[1].eyebrow}
            </h4>
            <h3 className="font-display text-2xl font-bold text-warm-white">
              {m.chapters[1].title}
            </h3>
            <p className="font-sans text-cine-muted leading-relaxed">
              {project.theFrame}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-cine-gold tracking-widest uppercase font-bold">
              {m.chapters[2].eyebrow}
            </h4>
            <h3 className="font-display text-2xl font-bold text-warm-white">
              {m.chapters[2].title}
            </h3>
            <p className="font-sans text-cine-muted leading-relaxed">
              {project.theProcess}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-cine-gold tracking-widest uppercase font-bold">
              {m.chapters[3].eyebrow}
            </h4>
            <h3 className="font-display text-2xl font-bold text-warm-white">
              {m.chapters[3].title}
            </h3>
            <p className="font-sans text-cine-muted leading-relaxed">
              {project.theFinalCut}
            </p>
          </div>
        </div>

        {/* High-Resolution Stills Gallery */}
        <div className="mb-20">
          <div className="flex items-center justify-between font-mono text-xs text-cine-muted tracking-widest uppercase border-b border-white/10 pb-4 mb-8">
            <span className="text-warm-white">{m.stillsTitle}</span>
            <span className="text-cine-gold font-bold">{project.stills.length} {m.framesArchived}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.stills.map((still, idx) => (
              <div key={idx} className="group relative rounded-sm overflow-hidden border border-white/10 bg-[#0e0e12] hover:border-cine-gold transition-all duration-300">
                <img
                  src={still.url}
                  alt={still.caption}
                  className="w-full h-64 sm:h-72 object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                  loading="lazy"
                />
                <div className="p-4 bg-[#0a0a0c] border-t border-white/5 flex items-center justify-between font-mono text-xs">
                  <span className="text-cine-muted">{still.caption}</span>
                  <span className="text-cine-gold font-bold">#{still.frameNo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Frame Navigation Bar */}
        <div className="p-8 md:p-12 bg-gradient-to-r from-[#0b0b0e] to-[#121218] border border-cine-gold/30 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <p className="font-mono text-xs text-cine-gold uppercase tracking-widest mb-1 font-bold">
              {m.nextEyebrow}
            </p>
            <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white">
              {m.nextPrefix} {nextProject.title}
            </h3>
          </div>

          <button
            onClick={handleNext}
            data-cursor="NEXT"
            className="px-8 py-4 bg-gradient-to-r from-cine-orange to-cine-gold text-black font-mono text-xs font-black tracking-widest uppercase rounded-sm flex items-center space-x-3 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(255,184,0,0.5)]"
          >
            <span>{m.nextButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

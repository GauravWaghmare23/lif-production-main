import React, { useState } from 'react';
import type { Project } from './types';
import clsx from 'clsx';
import { soundEngine } from './utils/audioSynth';
import { SECTION_ORDER, sectionDomId, scrollToSection } from './data/site';
import { Cursor } from './components/Cursor';
import { Header } from './components/Header';
import { SectionNav } from './components/SectionNav';
import { Hero } from './components/Hero';
import { ParallaxStatement } from './components/ParallaxStatement';
import { Manifesto } from './components/Manifesto';
import { SelectedWork } from './components/SelectedWork';
import { ProductionProcess } from './components/ProductionProcess';
import { StatsAndClients } from './components/StatsAndClients';
import { AwardsSection } from './components/AwardsSection';
import { BrandLogos } from './components/BrandLogos';
import { ParallaxMosaic } from './components/ParallaxMosaic';
import { ProjectModal } from './components/ProjectModal';
import { ProjectInquiryModal } from './components/ProjectInquiryModal';
import { Footer } from './components/Footer';
import { TeamCredits } from './components/TeamCredits';
import { Showreel } from './components/Showreel';
import { Services } from './components/Services';

export function App() {
  const [soundActive, setSoundActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    soundEngine.setMuted(!next);
  };

  const openInquiry = () => setInquiryModalOpen(true);

  /**
   * Section registry.
   *
   * The ORDER of the page is controlled by the "order" array in
   * src/data/sections.json — move an id up or down there to reorder.
   * Each id below maps to one component.
   */
  const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
    // Frame 00:00 — video background, "Visualization shows. cinema sells."
    hero: (
      <Hero
        onWatchShowreel={() => scrollToSection('showreel')}
        onExploreWork={() => scrollToSection(SECTION_ORDER[1] ?? 'work')}
      />
    ),
    // Pinned statement — "Director led. Studio built."
    statement: <ParallaxStatement />,
    // Positioning — "THE 3D IS READY. NOW IT NEEDS A FILM."
    manifesto: <Manifesto onOpenInquiry={openInquiry} />,
    // Directors cut reel
    showreel: <Showreel />,
    // Selected projects (opens the case-study modal)
    work: <SelectedWork onSelectProject={setSelectedProject} />,
    // Capabilities
    services: <Services onOpenInquiry={openInquiry} />,
    // Pinned 4-stage production process
    process: <ProductionProcess />,
    // By the numbers
    stats: <StatsAndClients />,
    // Awards & accolades
    awards: <AwardsSection />,
    // Trusted by — client marquee
    clients: <BrandLogos />,
    // Crew roster
    team: <TeamCredits />,
    // Motion archive + closing "create with us." panels
    archive: <ParallaxMosaic onSelectProject={setSelectedProject} />,
  };

  return (
    <div className={clsx('relative',
      'min-h-screen',
      'bg-[#000000]',
      'text-white',
      'font-sans',
      "overflow-x-clip", 'selection:bg-[#0066FF]', 'selection:text-white')}>

      {/* Custom follower cursor */}
      <Cursor />

      {/* Scroll progress line + side section dots */}
      <SectionNav />

      {/* Navigation Header */}
      <Header
        soundActive={soundActive}
        onToggleSound={handleToggleSound}
        onOpenInquiry={openInquiry}
      />

      <main>
        {SECTION_ORDER.map((id) =>
          SECTION_COMPONENTS[id] ? (
            <div key={id} id={sectionDomId(id)} data-section={id}>
              {SECTION_COMPONENTS[id]}
            </div>
          ) : null
        )}
      </main>

      {/* Footer — 3-column layout, contact button, social links */}
      <Footer onOpenInquiry={openInquiry} />

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
      />

      {/* Inquiry Modal */}
      <ProjectInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

    </div>
  );
}

export default App;

import React from 'react';

export const ShadersOverlay: React.FC = () => {
  return (
    <>
      {/* 35mm Film Grain Noise Layer */}
      <div className="film-grain-overlay" />

      {/* Subtle Scanline CRT Effect */}
      <div className="pointer-events-none fixed inset-0 z-[9980] opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

      {/* Radial Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[9970] shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
    </>
  );
};

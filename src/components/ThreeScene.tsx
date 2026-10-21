import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioSynth';

interface ThreeSceneProps {
  interactive?: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensFocal, setLensFocal] = useState('35MM T1.4');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. BUILD 3D ANAMORPHIC CAMERA LENS (GOLDEN AMBER EDITION) ---
    const lensGroup = new THREE.Group();

    // Outer Main Barrel (Dark Matte Charcoal Metal)
    const barrelGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.2, 48, 1, true);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    lensGroup.add(barrel);

    // Focus & Iris Rings with ribbed knurling (Multi-shade Blue & Cyan rings)
    for (let i = -1.2; i <= 1.2; i += 0.6) {
      const ringGeo = new THREE.TorusGeometry(1.63, 0.045, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0x00F0FF : i === 0.6 ? 0x0052FF : i === -0.6 ? 0x6366F1 : 0x38BDF8,
        metalness: 0.95,
        roughness: 0.12
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = i;
      lensGroup.add(ring);
    }

    // Anamorphic Front Bezel (Dark Titanium with Cyan Accent)
    const frontBezelGeo = new THREE.CylinderGeometry(1.85, 1.6, 0.5, 48);
    const frontBezelMat = new THREE.MeshStandardMaterial({
      color: 0x121215,
      metalness: 0.92,
      roughness: 0.18
    });
    const frontBezel = new THREE.Mesh(frontBezelGeo, frontBezelMat);
    frontBezel.rotation.x = Math.PI / 2;
    frontBezel.position.z = 1.6;
    lensGroup.add(frontBezel);

    // Front Cyan Accent Ring (Lost In Frame signature)
    const goldAccentGeo = new THREE.TorusGeometry(1.86, 0.03, 16, 64);
    const goldAccentMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    const goldAccent = new THREE.Mesh(goldAccentGeo, goldAccentMat);
    goldAccent.position.z = 1.85;
    lensGroup.add(goldAccent);

    // Front Glass Element (Curved Convex Optical Glass with Cyan Anti-Reflective Coating)
    const glassGeo = new THREE.SphereGeometry(1.7, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x80e5ff,
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.92,
      thickness: 1.3,
      ior: 1.58,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.88
    });
    const frontGlass = new THREE.Mesh(glassGeo, glassMat);
    frontGlass.position.z = 1.4;
    lensGroup.add(frontGlass);

    // Internal Aperture Blades (Sapphire Cobalt iris)
    const irisGroup = new THREE.Group();
    for (let b = 0; b < 9; b++) {
      const bladeGeo = new THREE.PlaneGeometry(0.6, 1.2);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x1e40af,
        metalness: 0.9,
        roughness: 0.25,
        side: THREE.DoubleSide
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (b / 9) * Math.PI * 2;
      blade.position.x = Math.cos((b / 9) * Math.PI * 2) * 0.4;
      blade.position.y = Math.sin((b / 9) * Math.PI * 2) * 0.4;
      irisGroup.add(blade);
    }
    irisGroup.position.z = -0.2;
    lensGroup.add(irisGroup);

    mainGroup.add(lensGroup);

    // --- 2. FLOATING FILM REELS & BLUE SPROCKET RINGS ---
    const filmReelGroup = new THREE.Group();
    const reelCoreGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.15, 48);
    const reelCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      metalness: 0.95,
      roughness: 0.15
    });
    const reelCore = new THREE.Mesh(reelCoreGeo, reelCoreMat);
    reelCore.rotation.x = Math.PI / 2;
    filmReelGroup.add(reelCore);

    // Reel spokes
    for (let s = 0; s < 6; s++) {
      const spokeGeo = new THREE.BoxGeometry(0.12, 4.4, 0.18);
      const spokeMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.9,
        roughness: 0.15
      });
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = (s / 6) * Math.PI;
      filmReelGroup.add(spoke);
    }
    filmReelGroup.position.set(0, 0, -2);
    filmReelGroup.visible = false;
    mainGroup.add(filmReelGroup);

    // --- 3. MULTI-SHADE BLUE DUST MOTES & PARTICLES COSMOS ---
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      positions[p] = (Math.random() - 0.5) * 15;
      positions[p + 1] = (Math.random() - 0.5) * 11;
      positions[p + 2] = (Math.random() - 0.5) * 13;

      // Multi-shade blue & cyan spectrum (Cobalt, Ice Cyan, Sky Blue, Indigo & White)
      const rand = Math.random();
      if (rand > 0.8) {
        colors[p] = 0.0; colors[p + 1] = 0.94; colors[p + 2] = 1.0; // Cyan #00F0FF
      } else if (rand > 0.6) {
        colors[p] = 0.0; colors[p + 1] = 0.32; colors[p + 2] = 1.0; // Cobalt #0052FF
      } else if (rand > 0.4) {
        colors[p] = 0.22; colors[p + 1] = 0.74; colors[p + 2] = 0.97; // Sky Blue #38BDF8
      } else if (rand > 0.2) {
        colors[p] = 0.39; colors[p + 1] = 0.4; colors[p + 2] = 0.95; // Indigo #6366F1
      } else {
        colors[p] = 1.0; colors[p + 1] = 1.0; colors[p + 2] = 1.0; // White spark
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 4. LIGHTING RIG (COOL ELECTRIC BLUE & CYAN) ---
    // Cool Key Light (Cyan 6500K)
    const keyLight = new THREE.DirectionalLight(0x66ccff, 3.2);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);

    // Cyan Rim Light (Anamorphic Blue Flare)
    const rimLight = new THREE.DirectionalLight(0x0099ff, 3.8);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Electric Blue Accent Point Light
    const goldPoint = new THREE.PointLight(0x00f0ff, 5, 16);
    goldPoint.position.set(0, -3, 3);
    scene.add(goldPoint);

    // Ambient Fill
    const ambientLight = new THREE.AmbientLight(0x141418, 1.2);
    scene.add(ambientLight);

    // --- 5. INTERACTION & ANIMATION LOOP ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.85;
      targetY = y * 0.65;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate Main Group based on mouse & time
      mainGroup.rotation.y = mouseX * 0.95 + Math.sin(elapsedTime * 0.3) * 0.18;
      mainGroup.rotation.x = -mouseY * 0.75 + Math.cos(elapsedTime * 0.25) * 0.12;

      // Internal lens rotation
      lensGroup.rotation.z = elapsedTime * 0.18;
      filmReelGroup.rotation.z = -elapsedTime * 0.22;

      // Slowly drift particles
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i);
        y -= 0.004;
        if (y < -5) y = 5;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      barrelGeo.dispose();
      barrelMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [interactive]);

  return (
    <div 
      className="relative w-full h-[640px] md:h-[760px] bg-gradient-to-b from-[#050505] via-[#0b0b0e] to-[#050505] border-y border-white/10 overflow-hidden flex items-center justify-center select-none"
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Optical HUD Overlays */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20 pointer-events-none">
        <div className="flex items-center space-x-2 text-cine-gold font-mono text-xs tracking-widest uppercase mb-1">
          <span className="w-2 h-2 rounded-full bg-cine-gold animate-ping shadow-[0_0_10px_#00F0FF]" />
          <span>3D OPTICAL ENGINE // STAGE 01</span>
        </div>
        <h3 className="font-display font-bold text-2xl md:text-3xl text-warm-white tracking-tight">
          ANAMORPHIC T1.4 PRIME
        </h3>
        <p className="font-mono text-xs text-cine-muted mt-1 max-w-xs">
          Interactive real-time WebGL refractive glass shader with blue anti-reflective flare coatings.
        </p>
      </div>

      {/* Technical Telemetry HUD Right */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 pointer-events-none hidden sm:block text-right font-mono text-[11px] text-cine-muted space-y-1">
        <p><span className="text-cine-gold font-bold">FOCAL:</span> {lensFocal}</p>
        <p><span className="text-warm-white">APERTURE:</span> T/1.4 - T/22</p>
        <p><span className="text-warm-white">SQUEEZE:</span> 2.0X ANAMORPHIC</p>
        <p><span className="text-cine-gold">FLARE:</span> BLUE COOKE /I</p>
      </div>

      {/* Interactive Lens Switcher Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cine-gold/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
        {[
          { label: '35MM T1.4', name: '35MM WIDE' },
          { label: '50MM T1.2', name: '50MM STANDARD' },
          { label: '85MM T1.4', name: '85MM PORTRAIT' }
        ].map((lens) => (
          <button
            key={lens.label}
            onClick={() => {
              setLensFocal(lens.label);
              soundEngine.playLensTick(1.2);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
              lensFocal === lens.label
                ? 'bg-gradient-to-r from-cine-orange to-cine-gold text-black font-black shadow-lg shadow-cine-amber/30'
                : 'text-cine-muted hover:text-warm-white hover:bg-white/5'
            }`}
          >
            {lens.name}
          </button>
        ))}
      </div>

      {/* Crosshair Center Reticle */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-30">
        <div className="w-16 h-16 border border-cine-gold/60 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-cine-gold rounded-full shadow-[0_0_8px_#00F0FF]" />
        </div>
        <div className="absolute w-24 h-[1px] bg-cine-gold/30" />
        <div className="absolute h-24 w-[1px] bg-cine-gold/30" />
      </div>

      {/* Ambient Radial Flare Glows */}
      <div className="absolute inset-0 pointer-events-none lens-flare-glow opacity-70" />
      <div className="absolute inset-0 pointer-events-none golden-flare-glow opacity-50" />
    </div>
  );
};

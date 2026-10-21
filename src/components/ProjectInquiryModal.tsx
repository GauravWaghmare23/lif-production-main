import React, { useState, useEffect } from 'react';
import type { InquiryFormData } from '../types';
import { soundEngine } from '../utils/audioSynth';
import { INQUIRY, SITE } from '../data/site';
import confetti from 'canvas-confetti';
import { X, ArrowRight, ArrowLeft, Check, Send, CheckCircle2 } from 'lucide-react';

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInquiryModal: React.FC<ProjectInquiryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<InquiryFormData>({
    ...INQUIRY.defaults,
    description: '',
    name: '',
    email: '',
    company: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsSubmitted(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Options come from src/data/inquiry.json
  const projectTypes = INQUIRY.projectTypes;
  const serviceOptions = INQUIRY.serviceOptions;
  const budgetCfg = INQUIRY.budget;
  const midBudget =
    Math.round((budgetCfg.min + budgetCfg.max) / 2 / budgetCfg.step) * budgetCfg.step;

  const toggleService = (srv: string) => {
    soundEngine.playLensTick(1.2);
    setFormData((prev) => {
      const exists = prev.services.includes(srv);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== srv)
          : [...prev.services, srv]
      };
    });
  };

  const handleNext = () => {
    soundEngine.playLensTick(1.3);
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    soundEngine.playLensTick(0.9);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playShutter();
    soundEngine.playSubImpact();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0066FF', '#00F0FF', '#0EA5E9', '#FFFFFF']
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b0b0e] border border-cine-gold/35 rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden p-6 sm:p-10 my-auto text-warm-white">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center space-x-3 font-mono text-xs text-cine-muted">
            <span className="text-cine-gold font-bold">INQUIRY // STEP 0{step} OF 05</span>
            <span>•</span>
            <span className="text-warm-white uppercase">{INQUIRY.title}</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playLensTick(0.8);
              onClose();
            }}
            data-cursor="CLOSE"
            className="p-2 hover:bg-white/10 rounded text-cine-muted hover:text-cine-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="w-full bg-white/10 h-1 mb-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cine-orange to-cine-gold transition-all duration-300 ease-out shadow-[0_0_10px_#00F0FF]"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="text-center py-12 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-cine-gold/20 text-cine-gold rounded-full flex items-center justify-center mx-auto border border-cine-gold/40 animate-pulse shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="font-condensed-hero text-5xl sm:text-6xl text-warm-white tracking-tight">
              {INQUIRY.success.title}
            </h2>

            <p className="font-sans text-cine-muted text-base max-w-md mx-auto">
              {INQUIRY.success.message.replace('{studios}', SITE.brand.studios.join(' and '))}
            </p>

            <div className="p-4 bg-white/5 border border-cine-gold/30 rounded-sm font-mono text-xs text-cine-gold max-w-md mx-auto font-bold">
              TRANSMISSION ID: #LIF-{Math.floor(100000 + Math.random() * 900000)} // ACES READY
            </div>

            <button
              onClick={() => {
                soundEngine.playLensTick(1.0);
                onClose();
              }}
              data-cursor="CLOSE"
              className="px-8 py-3.5 bg-gradient-to-r from-cine-orange to-cine-gold text-black font-mono text-xs font-black tracking-widest uppercase rounded-sm hover:scale-105 transition-all shadow-lg"
            >
              {INQUIRY.success.button}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* STEP 01: Project Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white mb-2">
                    WHAT ARE WE CREATING?
                  </h3>
                  <p className="font-mono text-xs text-cine-gold uppercase font-bold">
                    SELECT THE PRIMARY PRODUCTION FORMAT
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, projectType: type });
                        soundEngine.playLensTick(1.2);
                      }}
                      className={`p-4 rounded-sm border text-left font-mono text-xs tracking-wider transition-all duration-300 ${
                        formData.projectType === type
                          ? 'bg-gradient-to-r from-cine-orange to-cine-gold text-black border-cine-gold shadow-lg shadow-cine-amber/25 font-black'
                          : 'bg-white/5 border-white/10 hover:border-cine-gold/40 text-cine-muted hover:text-warm-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 02: Required Services */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white mb-2">
                    REQUIRED DISCIPLINES
                  </h3>
                  <p className="font-mono text-xs text-cine-gold uppercase font-bold">
                    SELECT ALL DEPARTMENTS NEEDED FOR THIS PRODUCTION
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceOptions.map((srv) => {
                    const isSelected = formData.services.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`p-4 rounded-sm border text-left font-mono text-xs tracking-wider transition-all duration-300 flex items-center justify-between ${
                          isSelected
                            ? 'bg-cine-gold/15 text-cine-gold border-cine-gold font-bold shadow-[0_0_12px_rgba(255,184,0,0.2)]'
                            : 'bg-white/5 border-white/10 text-cine-muted hover:text-warm-white'
                        }`}
                      >
                        <span>{srv}</span>
                        {isSelected && <Check className="w-4 h-4 text-cine-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 03: Budget Slider */}
            {step === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white mb-2">
                    PRODUCTION BUDGET
                  </h3>
                  <p className="font-mono text-xs text-cine-gold uppercase font-bold">
                    ESTIMATED PRODUCTION EXPENDITURE (USD)
                  </p>
                </div>

                <div className="p-8 bg-black/60 border border-cine-gold/30 rounded-sm text-center shadow-inner">
                  <div className="font-condensed-hero text-6xl sm:text-7xl text-cine-gold mb-2 drop-shadow-[0_0_15px_rgba(255,184,0,0.4)]">
                    ${formData.budget.toLocaleString()}+
                  </div>
                  <p className="font-mono text-xs text-cine-muted uppercase">
                    {formData.budget < 50000
                      ? 'INDIE CINEMA & MUSIC VIDEO SCALE'
                      : formData.budget < 120000
                      ? 'NATIONAL COMMERCIAL / DOC SCALE'
                      : 'GLOBAL HIGH-IMPACT / LARGE FORMAT CINEMA'}
                  </p>

                  <input
                    type="range"
                    min={budgetCfg.min}
                    max={budgetCfg.max}
                    step={budgetCfg.step}
                    value={formData.budget}
                    onChange={(e) => {
                      setFormData({ ...formData, budget: Number(e.target.value) });
                      soundEngine.playLensTick(0.9);
                    }}
                    className="w-full mt-8 accent-cine-gold cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-cine-muted mt-2">
                    <span>{budgetCfg.minLabel}</span>
                    <span className="text-cine-gold font-bold">${midBudget.toLocaleString()}</span>
                    <span>{budgetCfg.maxLabel}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 04: Narrative Vision */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white mb-2">
                    THE STORY & VISION
                  </h3>
                  <p className="font-mono text-xs text-cine-gold uppercase font-bold">
                    TELL US ABOUT THE STORY, TONE, OR TARGET DELIVERABLES
                  </p>
                </div>

                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the aesthetic, references, story beats, or emotional reaction you want to evoke..."
                  className="w-full p-4 bg-black/60 border border-white/15 focus:border-cine-gold outline-none rounded-sm font-sans text-sm text-warm-white resize-none"
                  required
                />
              </div>
            )}

            {/* STEP 05: Contact Info */}
            {step === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-condensed-hero text-4xl sm:text-5xl text-warm-white mb-2">
                    COMMUNICATION LINK
                  </h3>
                  <p className="font-mono text-xs text-cine-gold uppercase font-bold">
                    WHO SHALL WE TRANSMIT THE TREATMENT TO?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-cine-muted uppercase block mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Liam Sterling"
                      className="w-full p-3 bg-black/60 border border-white/15 focus:border-cine-gold outline-none rounded-sm font-sans text-sm text-warm-white"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-cine-muted uppercase block mb-1">
                      WORK EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. liam@agency.com"
                      className="w-full p-3 bg-black/60 border border-white/15 focus:border-cine-gold outline-none rounded-sm font-sans text-sm text-warm-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-mono text-[10px] text-cine-muted uppercase block mb-1">
                      COMPANY / BRAND / STUDIO
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Paramount / Porsche Creative"
                      className="w-full p-3 bg-black/60 border border-white/15 focus:border-cine-gold outline-none rounded-sm font-sans text-sm text-warm-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-cine-muted hover:text-white rounded-sm font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREVIOUS</span>
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-cine-orange to-cine-gold text-black font-mono text-xs font-black tracking-wider uppercase rounded-sm transition-all hover:scale-105 shadow-md shadow-cine-amber/30"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cine-orange to-cine-gold text-black rounded-sm font-mono text-xs font-black tracking-widest uppercase transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,184,0,0.5)]"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT BRIEF →</span>
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

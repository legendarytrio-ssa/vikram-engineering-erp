// src/pages/VikramLandingPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { VIKRAM_CHAPTERS } from "../data/VikramLandingData";
import ForgeCanvas from "../components/landing/ForgeCanvas";
import KindleLoader from "../components/landing/KindleLoader";
import {
  LandingNavbar,
  ChapterOverlay,
  WorkshopIndex,
} from "../components/landing/ChapterOverlay";
import CommissionFooter from "../components/landing/CommissionFooter";

// Total discrete pages:
// Step 0: Opening Lockup (Hero)
// Steps 1..8: The 8 ERP Chapters
// Step 9: Rising Commission & Role Gateway Sheet
const TOTAL_STEPS = VIKRAM_CHAPTERS.length + 1; // 9 (0 to 9)
const TRANSITION_MS = 750;
const WHEEL_COOLDOWN_MS = 900;

export default function VikramLandingPage({ onNavigateRole }) {
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionBurn, setTransitionBurn] = useState(0);

  const stepRef = useRef(0);
  const lockRef = useRef(false);
  const touchStartYRef = useRef(null);
  const burnAnimRef = useRef(null);

  // Unified transition function used by wheel, keyboard, touch, navbar, and 01-08 index
  const navigateToStep = useCallback((targetStep) => {
    const clamped = Math.max(0, Math.min(TOTAL_STEPS, targetStep));
    if (lockRef.current || clamped === stepRef.current) return;

    const dir = clamped > stepRef.current ? 1 : -1;
    lockRef.current = true;
    stepRef.current = clamped;

    setDirection(dir);
    setCurrentStep(clamped);
    setIsTransitioning(true);

    // Animate the molten ember ring & particle surge smoothly from 0 -> 1 -> 0
    if (burnAnimRef.current) cancelAnimationFrame(burnAnimRef.current);
    const startTime = performance.now();

    const animateBurn = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / TRANSITION_MS);
      setTransitionBurn(t);

      if (t < 1) {
        burnAnimRef.current = requestAnimationFrame(animateBurn);
      } else {
        setTransitionBurn(0);
        setIsTransitioning(false);
      }
    };
    burnAnimRef.current = requestAnimationFrame(animateBurn);

    // Release scroll lock after transition + brief trackpad inertia guard
    setTimeout(() => {
      lockRef.current = false;
    }, WHEEL_COOLDOWN_MS);
  }, []);

  // 1. Wheel Handler (Downscroll -> Next Page, Upscroll -> Previous Page)
  useEffect(() => {
    if (!loaded) return;

    const handleWheel = (e) => {
      // If footer is open, let CommissionFooter handle internal scroll first
      if (stepRef.current === TOTAL_STEPS) return;

      e.preventDefault();
      if (lockRef.current) return;

      // Ignore tiny trackpad micro-jitters
      if (Math.abs(e.deltaY) < 20) return;

      if (e.deltaY > 0) {
        navigateToStep(stepRef.current + 1);
      } else if (e.deltaY < 0) {
        navigateToStep(stepRef.current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [loaded, navigateToStep]);

  // 2. Keyboard Navigation (ArrowDown / PageDown / ArrowUp / PageUp)
  useEffect(() => {
    if (!loaded) return;

    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        navigateToStep(stepRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateToStep(stepRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToStep(0);
      } else if (e.key === "End") {
        e.preventDefault();
        navigateToStep(TOTAL_STEPS);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loaded, navigateToStep]);

  // 3. Touch Swipe Navigation for Mobile/Tablet
  const handleTouchStart = (e) => {
    if (stepRef.current === TOTAL_STEPS) return;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (stepRef.current === TOTAL_STEPS || touchStartYRef.current === null) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;

    if (Math.abs(deltaY) < 40) return;
    if (deltaY > 0) {
      navigateToStep(stepRef.current + 1);
    } else {
      navigateToStep(stepRef.current - 1);
    }
  };

  // Determine active chapter index (0..7) for the 3D canvas
  const activeChapterIndex = Math.max(
    0,
    Math.min(VIKRAM_CHAPTERS.length - 1, currentStep - 1)
  );
  const showLockup = currentStep === 0;
  const isFooterOpen = currentStep === TOTAL_STEPS;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-screen overflow-hidden bg-[#0a0806] text-[#f2ece2] font-sans select-none"
    >
      {/* 1. Lightweight Kindling Ignition Loader */}
      {!loaded && <KindleLoader onComplete={() => setLoaded(true)} />}

      {/* 2. Fixed Interactive 3D & Ember Stage */}
      <ForgeCanvas
        currentStep={currentStep}
        activeChapterIndex={activeChapterIndex}
        transitionBurn={transitionBurn}
        direction={direction}
        chapters={VIKRAM_CHAPTERS}
      />

      {/* 3. Top Navigation Bar */}
      <LandingNavbar
        visible={loaded && !isFooterOpen}
        currentStep={currentStep}
        onNavigateStep={navigateToStep}
      />

      {/* 4. Opening House Lockup (Step 0) */}
      <div
        className={`fixed left-1/2 md:left-[clamp(30px,5.5vw,110px)] top-[47%] -translate-x-1/2 md:translate-x-0 z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          loaded && showLockup
            ? "-translate-y-1/2 opacity-100 visible"
            : "-translate-y-[65%] opacity-0 invisible"
        }`}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <span className="font-serif text-[clamp(44px,8.5vw,148px)] leading-none tracking-[0.14em] text-[#f2ece2] drop-shadow-[0_0_25px_rgba(10,8,6,0.8)]">
            VIKRAM
          </span>
          <span
            className="font-mono text-[clamp(11px,1vw,16px)] tracking-[0.24em] uppercase opacity-90 text-amber-400"
            style={{ writingMode: "vertical-rl" }}
          >
            METALLURGY
          </span>
          <span className="grid place-items-center w-[clamp(30px,2.5vw,44px)] aspect-square bg-[#a3392c] text-[#f6ead5] text-[clamp(11px,0.86vw,15px)] leading-tight rounded-[2px] self-end mb-2 shadow-[inset_0_0_0_2px_rgba(246,234,213,0.18)]">
            V<br />E
          </span>
        </div>
        <p className="mt-5 font-serif italic text-[clamp(18px,1.75vw,28px)] text-[#f2ece2]/90">
          Eight encapsulated metallurgy & ERP workflows, engineered for scale
        </p>
        <div className="mt-8 pointer-events-auto">
          <button
            onClick={() => navigateToStep(1)}
            className="px-5 py-2.5 border border-amber-500/40 bg-[#1a120b]/80 text-amber-300 text-[11px] tracking-[0.2em] uppercase hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
          >
            Enter Workflow Index ↓
          </button>
        </div>
      </div>

      {/* 5. Directional Chapter Overlays (Steps 1..8) */}
      <ChapterOverlay
        chapters={VIKRAM_CHAPTERS}
        currentStep={currentStep}
        isTransitioning={isTransitioning}
      />

      {/* 6. Bottom-Left Volume Stamp & Center Scroll Cue */}
      <div
        className={`fixed left-5 md:left-[30px] bottom-5 md:bottom-[28px] z-20 text-[11.5px] tracking-[0.2em] uppercase text-[#f2ece2]/60 transition-opacity duration-500 pointer-events-none ${
          loaded && !isFooterOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        Vol. 01 — Vikram-Engineer
        <span className="block mt-1.5 text-[12px] tracking-[0.14em] normal-case opacity-75 text-amber-400">
          MERN · Cloudflare R2 · RBAC
        </span>
      </div>

      <button
        onClick={() => navigateToStep(currentStep + 1)}
        className={`hidden md:block fixed left-1/2 bottom-[26px] -translate-x-1/2 z-20 text-[11px] tracking-[0.24em] uppercase text-center transition-opacity duration-500 cursor-pointer ${
          loaded && !isFooterOpen ? "opacity-75 hover:opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span>{showLockup ? "Scroll to Ignite" : "Next Module"}</span>
        <span className="block w-[1px] h-[22px] mx-auto mt-2.5 bg-gradient-to-b from-[#f2ece2]/35 to-transparent" />
      </button>

      {/* 7. Persistent Bottom-Right 01–08 Index */}
      <WorkshopIndex
        chapters={VIKRAM_CHAPTERS}
        currentStep={currentStep}
        onNavigateStep={navigateToStep}
        visible={loaded && !isFooterOpen}
      />

      {/* 8. Rising Deckle-Edge Commission & Gateway Sheet (Step 9) */}
      <CommissionFooter
        isActive={isFooterOpen}
        onStepUp={() => navigateToStep(TOTAL_STEPS - 1)}
        onBackToTop={() => navigateToStep(0)}
        onRoleNavigate={(roleId) => {
          if (onNavigateRole) {
            onNavigateRole(roleId);
          } else {
            window.location.href = `/${roleId}-dashboard`;
          }
        }}
      />
    </div>
  );
}
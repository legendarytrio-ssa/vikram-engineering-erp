// src/components/landing/ChapterOverlay.jsx
import React from "react";

export function LandingNavbar({ currentStep, onNavigateStep, visible }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[60px] z-20 flex items-center gap-7 px-5 md:px-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background:
          "linear-gradient(rgba(9,7,5,0.75), rgba(9,7,5,0.35) 55%, rgba(9,7,5,0))",
      }}
    >
      <button
        onClick={() => onNavigateStep(0)}
        className="text-[18px] tracking-[0.02em] text-[#f2ece2] hover:opacity-75 transition-opacity flex items-center cursor-pointer"
      >
        VIKRAM-ENGINEER
        <span className="text-[11px] ml-3 px-2 py-0.5 border border-amber-500/30 text-amber-400 tracking-[0.14em] uppercase">
          METALLURGY ERP
        </span>
      </button>

      <nav className="hidden md:flex gap-6 text-[14px] text-[#f2ece2]/75">
        <button
          onClick={() => onNavigateStep(1)}
          className={`hover:text-amber-400 transition-colors cursor-pointer ${
            currentStep >= 1 && currentStep <= 2 ? "text-amber-400" : ""
          }`}
        >
          Tenders & Clearance
        </button>
        <button
          onClick={() => onNavigateStep(3)}
          className={`hover:text-amber-400 transition-colors cursor-pointer ${
            currentStep >= 3 && currentStep <= 5 ? "text-amber-400" : ""
          }`}
        >
          Operations
        </button>
        <button
          onClick={() => onNavigateStep(6)}
          className={`hover:text-amber-400 transition-colors cursor-pointer ${
            currentStep >= 6 && currentStep <= 8 ? "text-amber-400" : ""
          }`}
        >
          Finance & CRM
        </button>
        <button
          onClick={() => onNavigateStep(9)}
          className={`hover:text-amber-400 transition-colors cursor-pointer ${
            currentStep === 9 ? "text-amber-400" : ""
          }`}
        >
          Enquiry
        </button>
      </nav>

      <div className="ml-auto flex items-center gap-5 text-[13px]">
        <span className="opacity-75 hidden sm:inline font-mono text-[11px] tracking-widest">
          STEP {String(currentStep).padStart(2, "0")} / 09
        </span>
        <button
          onClick={() => onNavigateStep(9)}
          className="bg-[#f2ece2] text-[#100c08] px-4 py-2 rounded-[2px] text-[12.5px] tracking-[0.02em] hover:bg-[#fffaf1] transition-colors shadow-[inset_0_0_0_1px_rgba(242,236,226,0.7)] cursor-pointer"
        >
          Gateway Access
        </button>
      </div>
    </header>
  );
}

export function ChapterOverlay({ chapters, currentStep, isTransitioning }) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {chapters.map((chapter, index) => {
        const chapterStep = index + 1; // Chapters are steps 1..8
        const isActive = currentStep === chapterStep;
        const isBefore = chapterStep < currentStep;
        const isRight = chapter.align === "right";

        // Smooth directional slide: above viewport if already passed, below if upcoming
        const translateClass = isActive
          ? "translate-y-0 opacity-100 visible"
          : isBefore
          ? "-translate-y-16 opacity-0 invisible"
          : "translate-y-16 opacity-0 invisible";

        return (
          <div
            key={chapter.id}
            className={`absolute inset-0 flex flex-col justify-end md:justify-center px-5 md:px-[clamp(30px,5.5vw,110px)] pb-[14vh] md:pb-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${translateClass} ${
              isRight ? "md:items-end md:text-right" : "items-start text-left"
            }`}
          >
            {/* Chapter Number & Rule */}
            <div
              className={`flex items-center gap-3.5 text-[13px] tracking-[0.26em] uppercase text-[#f2ece2]/65 mb-3 ${
                isRight ? "md:flex-row-reverse" : ""
              }`}
            >
              <span className="block w-12 h-[1px] bg-[#f2ece2]/20" />
              <span>{chapter.num}</span>
            </div>

            {/* Big Serif Title + English Engineering Code */}
            <div
              className={`font-serif text-[clamp(52px,11vw,165px)] leading-[0.84] tracking-[-0.02em] text-[#f2ece2] flex items-baseline gap-4 flex-wrap ${
                isRight ? "md:flex-row-reverse" : ""
              }`}
            >
              <span>{chapter.title}</span>
              <span className="font-mono text-[clamp(14px,1.8vw,24px)] tracking-[0.16em] uppercase text-amber-400/90">
                {chapter.code}
              </span>
            </div>

            {/* Lede Copy */}
            <p className="font-serif italic text-[clamp(18px,2vw,32px)] leading-[1.3] max-w-[18em] mt-5 text-[#f2ece2]/90">
              {chapter.lede}
            </p>

            {/* 3-Column Metadata */}
            <div className="flex flex-wrap gap-7 md:gap-12 mt-6 text-[12px] tracking-[0.1em] uppercase text-[#f2ece2]/60">
              {chapter.meta.map((m, idx) => (
                <div key={idx}>
                  {m.label}
                  <b className="block font-normal text-[16px] tracking-[0.01em] normal-case text-[#f2ece2] mt-1">
                    {m.value}
                  </b>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WorkshopIndex({ chapters, currentStep, onNavigateStep, visible }) {
  return (
    <div
      className={`fixed right-5 md:right-[30px] bottom-5 md:bottom-[28px] z-20 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {chapters.map((ch, idx) => {
        const stepNum = idx + 1;
        const isCurrent = currentStep === stepNum;
        return (
          <React.Fragment key={ch.id}>
            <u
              className={`no-underline text-[11.5px] tabular-nums leading-[18px] transition-all duration-300 ${
                isCurrent
                  ? "opacity-100 text-amber-400 font-semibold"
                  : "opacity-40 hidden md:inline"
              }`}
            >
              {String(stepNum).padStart(2, "0")}
              <span className="md:hidden"> / 08</span>
            </u>
            <button
              onClick={() => onNavigateStep(stepNum)}
              className={`text-[13px] leading-[18px] text-right transition-all duration-300 cursor-pointer ${
                isCurrent
                  ? "opacity-100 text-[#f2ece2] translate-x-0"
                  : "opacity-45 hover:opacity-100 hidden md:inline"
              }`}
            >
              {ch.title}
              <i className="not-italic text-[11px] opacity-70 ml-2 tracking-[0.06em] text-amber-400/90">
                {ch.tag}
              </i>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
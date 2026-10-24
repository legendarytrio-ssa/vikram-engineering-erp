// src/components/landing/KindleLoader.jsx
import React, { useEffect, useState } from "react";

export default function KindleLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 420);
          return 100;
        }
        return prev + 4;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Expanding Molten Ember Ring */}
      <div
        className="rounded-full border border-amber-500/70 shadow-[0_0_60px_rgba(245,158,11,0.55),inset_0_0_35px_rgba(234,88,12,0.5)] transition-all duration-75"
        style={{
          width: `${Math.max(18, progress * 3.2)}px`,
          height: `${Math.max(18, progress * 3.2)}px`,
          opacity: progress / 100,
        }}
      />

      {/* Kindling Label & Tabular Counter */}
      <div
        role="progressbar"
        aria-label="Igniting Vikram-Engineer ERP"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-16 flex items-baseline gap-3.5 text-[11px] tracking-[0.26em] uppercase text-[#f2ece2]/55"
      >
        <span>Kindling Forge</span>
        <b className="font-normal min-w-[3ch] tracking-[0.06em] tabular-nums text-[#f2ece2]/85">
          {progress}
        </b>
      </div>
    </div>
  );
}
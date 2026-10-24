// src/components/landing/ForgeCanvas.jsx
import React, { useEffect, useRef } from "react";

export default function ForgeCanvas({
  currentStep,
  activeChapterIndex,
  transitionBurn,
  direction,
  chapters,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    currentStep,
    activeChapterIndex,
    transitionBurn,
    direction,
  });

  // Keep latest props accessible inside the 60fps animation loop
  useEffect(() => {
    stateRef.current = {
      currentStep,
      activeChapterIndex,
      transitionBurn,
      direction,
    };
  }, [currentStep, activeChapterIndex, transitionBurn, direction]);

  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.35,
    rotY: 0.5,
    posX: null,
    posY: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    // Generate lightweight ember particles
    const sparks = Array.from({ length: 85 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: -(0.0008 + Math.random() * 0.0022),
      size: 1 + Math.random() * 2.4,
      alpha: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // 3D Point Projection Helper
    const project = (x, y, z, cx, cy, scale, rotX, rotY) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const fov = 420;
      const dist = 4.2;
      const p = fov / (dist + z2);
      return {
        x: cx + x1 * p * scale,
        y: cy + y2 * p * scale,
        z: z2,
      };
    };

    // Build 3D vertices & edges per ERP chapter shape
    const getGeometry = (shapeType) => {
      const verts = [];
      const edges = [];

      if (shapeType === "cube" || shapeType === "billets") {
        const sx = shapeType === "billets" ? 1.5 : 1;
        const sy = shapeType === "billets" ? 0.55 : 1;
        const sz = 1;
        for (let i = -1; i <= 1; i += 2) {
          for (let j = -1; j <= 1; j += 2) {
            for (let k = -1; k <= 1; k += 2) {
              verts.push([i * sx, j * sy, k * sz]);
            }
          }
        }
        edges.push(
          [0, 1], [1, 3], [3, 2], [2, 0],
          [4, 5], [5, 7], [7, 6], [6, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        );
      } else if (shapeType === "octahedron") {
        verts.push(
          [0, 1.5, 0], [0, -1.5, 0],
          [1.4, 0, 0], [-1.4, 0, 0],
          [0, 0, 1.4], [0, 0, -1.4]
        );
        edges.push(
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2]
        );
      } else {
        const segs = 16;
        for (let i = 0; i < segs; i++) {
          const a = (i / segs) * Math.PI * 2;
          verts.push([
            Math.cos(a) * 1.4,
            Math.sin(a) * 1.4,
            0.25 * Math.sin(a * 3),
          ]);
          verts.push([
            Math.cos(a) * 0.85,
            Math.sin(a) * 0.85,
            -0.25 * Math.cos(a * 3),
          ]);
          const next = (i + 1) % segs;
          edges.push(
            [i * 2, next * 2],
            [i * 2 + 1, next * 2 + 1],
            [i * 2, i * 2 + 1]
          );
        }
      }
      return { verts, edges };
    };

    let time = 0;
    const render = () => {
      time += 0.016;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const {
        currentStep: step,
        activeChapterIndex: chIdx,
        transitionBurn: burn,
        direction: dir,
      } = stateRef.current;

      // 1. Warm dark foundry background
      ctx.fillStyle = "#0a0806";
      ctx.fillRect(0, 0, w, h);

      const currentChapter = chapters[chIdx] || chapters[0];
      const accent = step === 0 ? "#f59e0b" : currentChapter.color || "#f59e0b";

      // Smoothly interpolate 3D model position across Hero (step 0) and Chapters (steps 1..8)
      const isRightText = step > 0 && currentChapter.align === "right";
      const targetCx =
        w > 820
          ? step === 0
            ? w * 0.65
            : isRightText
            ? w * 0.32
            : w * 0.68
          : w * 0.5;
      const targetCy = w > 820 ? h * 0.5 : h * 0.34;

      if (dragRef.current.posX === null) {
        dragRef.current.posX = targetCx;
        dragRef.current.posY = targetCy;
      } else {
        dragRef.current.posX += (targetCx - dragRef.current.posX) * 0.08;
        dragRef.current.posY += (targetCy - dragRef.current.posY) * 0.08;
      }

      const cx = dragRef.current.posX;
      const cy = dragRef.current.posY;

      // 2. Ambient forge glow behind 3D model
      const radGrad = ctx.createRadialGradient(
        cx,
        cy,
        10,
        cx,
        cy,
        Math.min(w, h) * 0.45
      );
      radGrad.addColorStop(0, `${accent}28`);
      radGrad.addColorStop(0.5, "rgba(180, 65, 18, 0.08)");
      radGrad.addColorStop(1, "rgba(10, 8, 6, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Auto-rotate smoothly + add kinetic spin burst during page transitions
      if (!dragRef.current.active) {
        const transitionBoost = burn * 0.045 * (dir || 1);
        dragRef.current.rotY += 0.008 + transitionBoost;
        dragRef.current.rotX = 0.35 + Math.sin(time * 0.6) * 0.12;
      }

      // 4. Draw 3D Engineered Model in place
      const shapeKey = step === 0 ? "lattice" : currentChapter.shape;
      const { verts, edges } = getGeometry(shapeKey);
      // Slight scale pulse during transition
      const scale = 0.25 * (1 - burn * 0.12);
      const projected = verts.map(([vx, vy, vz]) =>
        project(
          vx,
          vy,
          vz,
          cx,
          cy,
          scale,
          dragRef.current.rotX,
          dragRef.current.rotY
        )
      );

      ctx.save();
      ctx.lineWidth = 1.35;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;
        const depthAlpha = Math.max(0.18, Math.min(0.95, (p1.z + p2.z + 3) / 5));
        ctx.strokeStyle = accent;
        ctx.globalAlpha = depthAlpha * (1 - burn * 0.35);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      projected.forEach((p) => {
        ctx.globalAlpha = 0.85 * (1 - burn * 0.35);
        ctx.fillStyle = "#f2ece2";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 5. Floating forge embers & cinders
      ctx.save();
      sparks.forEach((s) => {
        s.x += s.vx + Math.sin(time + s.phase) * 0.0003;
        s.y += s.vy * (1 + burn * 3.2);
        if (s.y < -0.05) {
          s.y = 1.05;
          s.x = Math.random();
        }
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;

        const px = s.x * w;
        const py = s.y * h;
        const flicker = 0.5 + 0.5 * Math.sin(time * 5 + s.phase);
        ctx.globalAlpha = s.alpha * flicker;
        ctx.fillStyle = s.size > 2.2 ? "#fbbf24" : "#ea580c";
        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 6. Smooth Page-Change Molten Burn Ring Sweep
      if (burn > 0.01) {
        const maxR = Math.hypot(w, h) * 0.65;
        const r = burn * maxR;
        const ringGrad = ctx.createRadialGradient(
          w * 0.5,
          h * 0.5,
          Math.max(1, r - 60),
          w * 0.5,
          h * 0.5,
          r + 40
        );
        ringGrad.addColorStop(0, "rgba(234, 88, 12, 0)");
        ringGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.26 * Math.sin(burn * Math.PI)})`);
        ringGrad.addColorStop(0.8, `rgba(254, 215, 170, ${0.38 * Math.sin(burn * Math.PI)})`);
        ringGrad.addColorStop(1, "rgba(10, 8, 6, 0)");
        ctx.fillStyle = ringGrad;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [chapters]);

  // Normal in-place drag rotation
  const handlePointerDown = (e) => {
    dragRef.current.active = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.rotY += dx * 0.01;
    dragRef.current.rotX += dy * 0.01;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="fixed inset-0 block w-full h-full cursor-grab active:cursor-grabbing z-0"
    />
  );
}
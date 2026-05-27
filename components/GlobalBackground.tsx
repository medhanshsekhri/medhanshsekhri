"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 80;
const STAR_REPEL_RADIUS = 90;
const STAR_MAX_PUSH = 35;

interface Star {
  el: HTMLDivElement;
  baseX: number;
  baseY: number;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
}

export default function GlobalBackground() {
  const starContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Star field (dark mode)
  useEffect(() => {
    const container = starContainerRef.current;
    if (!container) return;

    const stars: Star[] = [];
    let mouseX = -9999, mouseY = -9999, rafId = 0;

    for (let i = 0; i < STAR_COUNT; i++) {
      const el = document.createElement("div");
      const size = 1.5 + Math.random() * 1;
      const bx = Math.random() * 100;
      const by = Math.random() * 100;
      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "white",
        left: `${bx}%`,
        top: `${by}%`,
        animationName: "twinkle",
        animationDuration: `${(2 + Math.random() * 4).toFixed(2)}s`,
        animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out",
        animationDirection: "alternate",
        willChange: "transform, opacity",
      });
      container.appendChild(el);
      stars.push({ el, baseX: bx, baseY: by, tx: 0, ty: 0, cx: 0, cy: 0 });
    }

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };

    function tick() {
      const W = window.innerWidth, H = window.innerHeight;
      for (const s of stars) {
        const sx = (s.baseX / 100) * W, sy = (s.baseY / 100) * H;
        const dx = mouseX - sx, dy = mouseY - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < STAR_REPEL_RADIUS && dist > 0) {
          const f = (1 - dist / STAR_REPEL_RADIUS) * STAR_MAX_PUSH;
          s.tx = -(dx / dist) * f;
          s.ty = -(dy / dist) * f;
        } else {
          s.tx = 0; s.ty = 0;
        }
        s.cx += (s.tx - s.cx) * 0.08;
        s.cy += (s.ty - s.cy) * 0.08;
        s.el.style.transform = `translate(${s.cx.toFixed(2)}px,${s.cy.toFixed(2)}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      stars.forEach(s => s.el.remove());
    };
  }, []);

  // Canvas grid with cursor distortion (light mode)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mouseX = -9999, mouseY = -9999, rafId = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);

    const SPACING = 48, RADIUS = 80, MAX_DISP = 12, STEP = 4;

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;

      const W = canvas.width, H = canvas.height;

      // Horizontal lines
      for (let row = 0; row * SPACING <= H; row++) {
        const baseY = row * SPACING;
        ctx.beginPath();
        let first = true;
        for (let x = 0; x <= W; x += STEP) {
          const dy = baseY - mouseY;
          const dist = Math.sqrt((x - mouseX) ** 2 + dy ** 2);
          const dispY = dist < RADIUS && dist > 0
            ? (dy / dist) * (1 - dist / RADIUS) * MAX_DISP
            : 0;
          if (first) { ctx.moveTo(x, baseY + dispY); first = false; }
          else ctx.lineTo(x, baseY + dispY);
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let col = 0; col * SPACING <= W; col++) {
        const baseX = col * SPACING;
        ctx.beginPath();
        let first = true;
        for (let y = 0; y <= H; y += STEP) {
          const dx = baseX - mouseX;
          const dist = Math.sqrt(dx ** 2 + (y - mouseY) ** 2);
          const dispX = dist < RADIUS && dist > 0
            ? (dx / dist) * (1 - dist / RADIUS) * MAX_DISP
            : 0;
          if (first) { ctx.moveTo(baseX + dispX, y); first = false; }
          else ctx.lineTo(baseX + dispX, y);
        }
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Canvas grid: light mode only */}
      <div
        className="fixed inset-0 block dark:hidden pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>

      {/* Stars: dark mode only */}
      <div
        ref={starContainerRef}
        className="fixed inset-0 hidden dark:block pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden
      />
    </>
  );
}

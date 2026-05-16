"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 120;
const REPEL_RADIUS = 90;
const MAX_PUSH = 35;
const LERP = 0.08;

interface StarState {
  el: HTMLDivElement;
  baseX: number;
  baseY: number;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars: StarState[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;

    // Build stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const el = document.createElement("div");
      const size = 1.5 + Math.random() * 1;
      const bx = Math.random() * 100;
      const by = Math.random() * 100;
      const dur = 2 + Math.random() * 4;
      const delay = Math.random() * 5;

      el.className = "star";
      Object.assign(el.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "white",
        left: `${bx}%`,
        top: `${by}%`,
        animationName: "starTwinkle",
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out",
        animationDirection: "alternate",
        willChange: "transform, opacity",
      });

      container.appendChild(el);

      stars.push({
        el,
        baseX: bx,
        baseY: by,
        tx: 0,
        ty: 0,
        cx: 0,
        cy: 0,
      });
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function tick() {
      const W = window.innerWidth;
      const H = window.innerHeight;

      for (const s of stars) {
        const starPxX = (s.baseX / 100) * W;
        const starPxY = (s.baseY / 100) * H;
        const dx = mouseX - starPxX;
        const dy = mouseY - starPxY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * MAX_PUSH;
          s.tx = -(dx / dist) * force;
          s.ty = -(dy / dist) * force;
        } else {
          s.tx = 0;
          s.ty = 0;
        }

        s.cx += (s.tx - s.cx) * LERP;
        s.cy += (s.ty - s.cy) * LERP;

        s.el.style.transform = `translate(${s.cx.toFixed(2)}px, ${s.cy.toFixed(2)}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      stars.forEach((s) => s.el.remove());
    };
  }, []);

  return (
    <>
      <style>{`
        #star-field .star { display: none; }
        .dark #star-field .star { display: block; }
      `}</style>
      <div
        id="star-field"
        ref={containerRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </>
  );
}

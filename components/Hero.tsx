"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type StarData = {
  id: number;
  ox: number;
  oy: number;
  size: number;
  delay: number;
  duration: number;
};

export default function Hero() {
  const [stars, setStars] = useState<StarData[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const starElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const starPosRef = useRef<{ cx: number; cy: number; tx: number; ty: number }[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const count = 100;
    const generated: StarData[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      ox: Math.random() * 100,
      oy: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generated);
    starPosRef.current = generated.map(() => ({ cx: 0, cy: 0, tx: 0, ty: 0 }));
    starElsRef.current = new Array(count).fill(null);
  }, []);

  useEffect(() => {
    if (stars.length === 0) return;
    const RADIUS = 80, MAX_PUSH = 30;
    const tick = () => {
      const container = containerRef.current;
      if (!container) { rafRef.current = requestAnimationFrame(tick); return; }
      const rect = container.getBoundingClientRect();
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      starPosRef.current.forEach((pos, i) => {
        const star = stars[i], el = starElsRef.current[i];
        if (!el || !star) return;
        const sx = rect.left + (star.ox / 100) * rect.width;
        const sy = rect.top + (star.oy / 100) * rect.height;
        const dx = sx + pos.cx - mx, dy = sy + pos.cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS && dist > 0) {
          const force = (RADIUS - dist) / RADIUS;
          const angle = Math.atan2(dy, dx);
          pos.tx = Math.cos(angle) * force * MAX_PUSH;
          pos.ty = Math.sin(angle) * force * MAX_PUSH;
        } else { pos.tx = 0; pos.ty = 0; }
        pos.cx += (pos.tx - pos.cx) * 0.1;
        pos.cy += (pos.ty - pos.cy) * 0.1;
        if (Math.abs(pos.cx) > 0.05 || Math.abs(pos.cy) > 0.05) {
          el.style.transform = `translate(${pos.cx.toFixed(2)}px,${pos.cy.toFixed(2)}px)`;
        }
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [stars]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
      onMouseMove={(e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; }}
      onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
    >
      {/* Hero-local stars — dark mode only */}
      <div className="absolute inset-0 pointer-events-none dark:block hidden" aria-hidden="true">
        {stars.map((star, i) => (
          <div
            key={star.id}
            ref={(el) => { starElsRef.current[i] = el; }}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.ox}%`,
              top: `${star.oy}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.5,
              animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        <motion.p
          className="text-xs font-body font-medium tracking-[0.22em] uppercase mb-5 text-[#E04B52] dark:text-[#C6A85B]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Mechanical and Aerospace Engineering
        </motion.p>

        <motion.h1
          className="font-display font-semibold leading-[0.95] tracking-tight text-text mb-6"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Hi, I&apos;m Medhansh{" "}
          <span className="text-[#E04B52] dark:text-[#C6A85B]">Sekhri.</span>
        </motion.h1>

        <motion.p
          className="text-muted font-body mb-6"
          style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
        >
          Engineered beyond the horizon.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-1 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="font-body text-muted" style={{ fontSize: 14, fontWeight: 400 }}>
            Bachelor of Engineering (Honours) and Master of Engineering
          </p>
          <p className="font-body text-muted flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 400 }}>
            <span
              className="inline-flex dark:hidden"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.1)", padding: 4, alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <img src="/UQ-300x300.png" alt="UQ" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </span>
            <span
              className="hidden dark:inline-flex"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#1A1A1F", border: "1px solid rgba(255,255,255,0.1)", padding: 4, alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <img src="/UQ-300x300.png" alt="UQ" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </span>
            @ The University of Queensland
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.66 }}
        >
          <a
            href="#projects"
            className="px-7 py-2.5 rounded-full text-sm font-body font-semibold text-white dark:text-[#0D0D0D] hover:opacity-90 transition-opacity"
            style={{ background: "var(--hero-btn-bg, linear-gradient(135deg,#FF6F91,#B28DFF))" }}
          >
            See My Work
          </a>
          <a
            href="#about"
            className="px-7 py-2.5 rounded-full border border-border text-text text-sm font-body font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Why Me
          </a>
          <a
            href="/Medhansh_Sekhri_Engineering_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-2.5 rounded-full border border-border text-text text-sm font-body font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Resume
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#8FB7B8] dark:text-[#C6A85B]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <span className="text-[10px] font-body tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown
          size={14}
          style={{ animation: "scroll-hint 1.8s ease-in-out infinite" }}
        />
      </motion.div>
    </section>
  );
}

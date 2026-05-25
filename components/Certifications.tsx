"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function GlassCard({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const currentRotX = useRef(0);
  const currentRotY = useRef(0);

  const startTilt = useCallback(() => {
    function tick() {
      currentRotX.current += (targetRotX.current - currentRotX.current) * 0.1;
      currentRotY.current += (targetRotY.current - currentRotY.current) * 0.1;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(800px) rotateX(${currentRotX.current.toFixed(2)}deg) rotateY(${currentRotY.current.toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTilt = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    targetRotX.current = 0;
    targetRotY.current = 0;
    const settle = () => {
      currentRotX.current += (0 - currentRotX.current) * 0.1;
      currentRotY.current += (0 - currentRotY.current) * 0.1;
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(800px) rotateX(${currentRotX.current.toFixed(2)}deg) rotateY(${currentRotY.current.toFixed(2)}deg)`;
      }
      if (Math.abs(currentRotX.current) > 0.01 || Math.abs(currentRotY.current) > 0.01) {
        rafRef.current = requestAnimationFrame(settle);
      } else if (cardRef.current) {
        cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      }
    };
    rafRef.current = requestAnimationFrame(settle);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    targetRotX.current = -y * 10;
    targetRotY.current = x * 10;
    if (highlightRef.current) {
      highlightRef.current.style.background = `radial-gradient(120px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.15) 0%, transparent 70%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    stopTilt();
    if (highlightRef.current) highlightRef.current.style.background = "transparent";
  }, [stopTilt]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={startTilt}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: 16,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px) saturate(150%)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.2)",
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden",
        willChange: "transform",
        height: "100%",
      }}
    >
      <div
        ref={highlightRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: "transparent",
          borderRadius: 16,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export default function Certifications() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <h2 className="font-display text-5xl md:text-6xl font-semibold text-text mb-16">
            Credentials and Experience.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          <FadeUp delay={0.1}>
            <GlassCard isDark={isDark}>
              <div className="p-8 h-full">
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] dark:hidden"
                  style={{ background: "#E04B52" }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] hidden dark:block"
                  style={{ background: "#C6A85B" }}
                />
                <span
                  className="text-3xl block mb-5 text-[#E04B52] dark:text-[#C6A85B]"
                  aria-hidden="true"
                >
                  ✈️
                </span>
                <p className="text-muted text-xs uppercase tracking-wider font-body mb-1">
                  Remote Pilot, UAV Operations
                </p>
                <h3 className="font-body font-semibold text-text text-lg mb-3">
                  Certificate III in Aviation
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  Certified remote pilot for UAV operations. Trained in airspace
                  regulations, flight planning, and safe operation of unmanned
                  aircraft systems under CASA guidelines.
                </p>
              </div>
            </GlassCard>
          </FadeUp>

          <FadeUp delay={0.2}>
            <GlassCard isDark={isDark}>
              <div className="p-8 h-full flex flex-col">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted mb-5">
                  <Plus size={16} />
                </div>
                <p className="text-muted text-xs uppercase tracking-wider font-body mb-1">
                  In Progress
                </p>
                <h3 className="font-body font-semibold text-text text-lg mb-3">
                  More Coming
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  Actively building toward additional certifications in embedded
                  systems and aerospace. Watch this space.
                </p>
              </div>
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

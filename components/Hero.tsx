"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FIRST = "Medhansh";
const LAST = " Sekhri.";

function MagneticLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 350, damping: 22, mass: 0.5 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left - rect.width / 2) * 0.28);
        my.set((e.clientY - rect.top - rect.height / 2) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full">
        <motion.p
          className="text-xs font-body font-medium tracking-[0.22em] uppercase mb-6 text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Mechanical and Aerospace Engineering
        </motion.p>

        {/* Name — each letter cascades in, then lifts on hover */}
        <h1
          className="font-display font-semibold leading-[0.95] tracking-tight text-text mb-7"
          style={{ fontSize: "clamp(3rem, 12vw, 9rem)" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {"Hi, I'm "}
          </motion.span>

          {FIRST.split("").map((letter, i) => (
            <motion.span
              key={`f-${i}`}
              initial={{ opacity: 0, y: "0.25em" }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              transition={{ duration: 0.45, delay: 0.45 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: "inline-block", cursor: "default" }}
            >
              {letter}
            </motion.span>
          ))}

          {LAST.split("").map((letter, i) => (
            <motion.span
              key={`l-${i}`}
              className={letter.trim() !== "" ? "text-accent" : ""}
              initial={{ opacity: 0, y: "0.25em" }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={
                letter.trim() !== ""
                  ? { y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }
                  : {}
              }
              transition={{ duration: 0.45, delay: 0.45 + (FIRST.length + i) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ display: "inline-block", cursor: "default" }}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-muted font-body mb-8"
          style={{ fontSize: "clamp(1rem, 3.5vw, 1.35rem)" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Engineered beyond the horizon.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-10 text-muted font-body text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--clr-surface)",
              border: "1px solid var(--clr-border)",
              padding: 3,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/UQ-300x300.png"
              alt="UQ"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </span>
          <span>BEng(Hons) + MEng · University of Queensland</span>
        </motion.div>

        {/* Magnetic buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MagneticLink
            href="#projects"
            className="px-6 py-2.5 bg-text text-bg text-sm font-body font-medium hover:opacity-75 transition-opacity rounded"
          >
            See My Work
          </MagneticLink>
          <MagneticLink
            href="#about"
            className="px-6 py-2.5 border border-border text-text text-sm font-body hover:border-text transition-colors rounded"
          >
            About
          </MagneticLink>
          <MagneticLink
            href="/Medhansh_Sekhri_Engineering_Resume.pdf"
            external
            className="px-6 py-2.5 border border-border text-text text-sm font-body hover:border-text transition-colors rounded"
          >
            Resume ↗
          </MagneticLink>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="text-[10px] font-body tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown size={13} style={{ animation: "scroll-hint 1.8s ease-in-out infinite" }} />
      </motion.div>
    </section>
  );
}

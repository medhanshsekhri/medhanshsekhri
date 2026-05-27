"use client";

import { useState, useRef } from "react";

const OPTIONS = [
  { label: "Projects", href: "/projects" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

const COLORS_LIGHT = [
  "linear-gradient(135deg, #E04B52, #F07878)",
  "linear-gradient(135deg, #5FE0B3, #8CE8CA)",
  "linear-gradient(135deg, #8C7AE6, #B5AAFC)",
];

const COLORS_DARK = [
  "linear-gradient(135deg, #C6A85B, #F0CC6A)",
  "linear-gradient(135deg, #0F8A5F, #22BC80)",
  "linear-gradient(135deg, #5C2A6B, #9B5FC0)",
];

interface GlassNavProps {
  isDark: boolean;
}

export default function GlassNav({ isDark }: GlassNavProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [glider, setGlider] = useState<{ left: number; width: number } | null>(null);
  const optRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = (i: number) => {
    const el = optRefs.current[i];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setGlider({ left: eRect.left - cRect.left, width: eRect.width });
    setHoveredIdx(i);
  };

  const handleLeave = () => setHoveredIdx(null);

  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div
      ref={containerRef}
      className="relative hidden md:flex items-center rounded-full px-1 py-1"
      style={{
        backdropFilter: "blur(12px)",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        boxShadow:
          "inset 1px 1px 4px rgba(255,255,255,0.2), inset -1px -1px 6px rgba(0,0,0,0.3)",
      }}
    >
      {/* Sliding glider */}
      <div
        className="absolute top-1 bottom-1 rounded-full pointer-events-none"
        style={{
          left: glider?.left ?? 0,
          width: glider?.width ?? 0,
          background: hoveredIdx !== null ? colors[hoveredIdx] : "transparent",
          opacity: hoveredIdx !== null ? 1 : 0,
          transition:
            "left 0.3s cubic-bezier(0.37, 1.95, 0.66, 0.56), width 0.3s cubic-bezier(0.37, 1.95, 0.66, 0.56), opacity 0.15s ease, background 0.15s ease",
        }}
      />

      {OPTIONS.map((opt, i) => (
        <a
          key={opt.href}
          ref={(el) => { optRefs.current[i] = el; }}
          href={opt.href}
          className="relative z-10 px-4 py-1.5 text-sm font-body font-medium rounded-full select-none"
          style={{
            color: hoveredIdx === i ? "#ffffff" : "var(--clr-muted)",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={() => handleEnter(i)}
          onMouseLeave={handleLeave}
        >
          {opt.label}
        </a>
      ))}
    </div>
  );
}

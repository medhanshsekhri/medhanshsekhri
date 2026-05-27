"use client";

import { useEffect, useRef } from "react";

const ITEMS = [
  "Aerospace",
  "Autonomous Systems",
  "C++",
  "Arduino",
  "Fusion 360",
  "Embedded Systems",
  "Flight Dynamics",
  "CAD",
  "PID Control",
  "Robotics",
  "Mechatronics",
  "First Principles",
];

interface TechMarqueeProps {
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  speed?: number;
}

export default function TechMarquee({
  pixelsPerFrame = 2,
  rotateY = -22,
  rotateX = 6,
  perspective = 1200,
  speed = 1,
}: TechMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One repetition's width, measured from the first half of the doubled track.
    let unitWidth = 0;
    const measure = () => {
      const el = trackRef.current;
      if (el) unitWidth = el.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    let raf = 0;
    let start: number | undefined;
    const loop = (t: number) => {
      if (start === undefined) start = t;
      const frame = ((t - start) / 16.6667) * speed;
      const offset = unitWidth > 0 ? -((frame * pixelsPerFrame) % unitWidth) : 0;
      if (trackRef.current) trackRef.current.style.transform = `translateX(${offset}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [pixelsPerFrame, speed]);

  // Doubled so the loop is seamless.
  const rendered = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-hidden
      className="relative w-full overflow-hidden select-none"
      style={{ height: "clamp(140px, 22vh, 260px)", perspective: `${perspective}px` }}
    >
      <div
        className="absolute inset-0 flex items-center"
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}
      >
        <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
          {rendered.map((item, i) => (
            <span
              key={i}
              className="font-display font-semibold text-muted/35"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                letterSpacing: "-0.02em",
                paddingRight: "0.9em",
                lineHeight: 1,
              }}
            >
              {item}
              <span className="text-accent/40"> · </span>
            </span>
          ))}
        </div>
      </div>

      {/* Edge fades for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--clr-bg) 0%, transparent 16%, transparent 84%, var(--clr-bg) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, var(--clr-bg) 0%, transparent 30%, transparent 70%, var(--clr-bg) 100%)",
        }}
      />
    </section>
  );
}

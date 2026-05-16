"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-cursor-pointer]";

export default function CursorTracker() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Determine if this is a hover-capable (non-touch) device
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) {
      setActive(true);
    }
  }, []);

  // Dark mode tracking
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Cursor tracking — runs only when active (hover device, refs populated)
  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = "none";

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId = 0;
    let ds = 1, rs = 1;
    let tds = 1, trs = 1;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(${ds.toFixed(3)})`;
    };

    const onDown = () => { tds = 0.6; };
    const onUp   = () => { tds = 1; };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) { tds = 2.5; trs = 1.8; }
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest(INTERACTIVE)) { tds = 1; trs = 1; }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    function tick() {
      if (!dot || !ring) return;
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ds += (tds - ds) * 0.18;
      rs += (trs - rs) * 0.14;
      dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%) scale(${ds.toFixed(3)})`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${rs.toFixed(3)})`;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [active]);

  if (!active) return null;

  const accent = isDark ? "#C6A85B" : "#E04B52";

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: accent,
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-200px, -200px)",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1.5px solid ${accent}`,
          background: "transparent",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-200px, -200px)",
          willChange: "transform",
        }}
      />
    </>
  );
}

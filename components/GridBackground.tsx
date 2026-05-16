"use client";

import { useEffect, useRef } from "react";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function GridBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let targetRX = 0;
    let targetRY = 0;
    let currentRX = 0;
    let currentRY = 0;

    function onMouseMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRY = ((e.clientX - cx) / cx) * 0.6;
      targetRX = -((e.clientY - cy) / cy) * 0.6;
    }

    function tick() {
      currentRX += (targetRX - currentRX) * 0.03;
      currentRY += (targetRY - currentRY) * 0.03;
      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `perspective(900px) rotateX(${currentRX.toFixed(4)}deg) rotateY(${currentRY.toFixed(4)}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 block dark:hidden pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <div
        ref={wrapRef}
        className="absolute inset-0"
        style={{ transformOrigin: "center center" }}
      >
        <GridPattern
          width={48}
          height={48}
          className="[&>svg]:stroke-[rgba(0,0,0,0.055)] fill-transparent stroke-[rgba(0,0,0,0.055)]"
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GalleryItem {
  image: string;
  text: string;
}

const CARD_W = 240;
const CARD_H = 320;
const CARD_GAP = 16;
const CARD_STEP = CARD_H + CARD_GAP;
const MAX_CURVE = 52;
const LERP = 0.08;

export default function VerticalGallery({ items }: { items: GalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 3 copies = 24 items for a long scrollable strip
  const allItems = [...items, ...items, ...items];
  const TOTAL = allItems.length;

  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const TOTAL_H = TOTAL * CARD_STEP;

    // Start scrolled to the middle of the list (beginning of 2nd copy)
    // so user can scroll both up and down
    const cH = container.clientHeight || 600;
    const initScroll = Math.max(0, items.length * CARD_STEP - cH / 2 + CARD_H / 2);
    scrollTarget.current = initScroll;
    scrollCurrent.current = initScroll;

    const getMaxScroll = () => Math.max(0, TOTAL_H - (container.clientHeight || 600));

    let raf = 0;

    function tick() {
      const sc = scrollCurrent.current;
      const t = scrollTarget.current;
      scrollCurrent.current = sc + (t - sc) * LERP;

      const containerH = container!.clientHeight || 600;
      const centerY = containerH / 2;

      // Update track translateY
      track!.style.transform = `translateY(${(-scrollCurrent.current).toFixed(2)}px)`;

      // Update each card's horizontal curve
      const wraps = cardWrapRefs.current;
      for (let i = 0; i < TOTAL; i++) {
        const el = wraps[i];
        if (!el) continue;
        const cardCenterY = i * CARD_STEP + CARD_H / 2 - scrollCurrent.current;
        const dist = cardCenterY - centerY;
        // Quadratic: centre = 0, edges = MAX_CURVE
        const t2 = dist / (containerH / 2);
        const tx = Math.min(MAX_CURVE, t2 * t2 * MAX_CURVE * 2.2);
        el.style.transform = `translateX(${tx.toFixed(2)}px)`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      scrollTarget.current = Math.max(
        0,
        Math.min(getMaxScroll(), scrollTarget.current + e.deltaY)
      );
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      scrollTarget.current = Math.max(
        0,
        Math.min(getMaxScroll(), scrollTarget.current + dy * 1.5)
      );
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [items, TOTAL]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        cursor: "ns-resize",
      }}
    >
      {/* Fade edges */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, var(--clr-surface) 0%, transparent 18%, transparent 82%, var(--clr-surface) 100%)",
        }}
      />

      <div
        ref={trackRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: CARD_GAP,
          paddingTop: 8,
          paddingBottom: 8,
          willChange: "transform",
        }}
      >
        {allItems.map((item, i) => (
          <div
            key={`${i}`}
            ref={(el) => { cardWrapRefs.current[i] = el; }}
            style={{ flexShrink: 0, willChange: "transform" }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              style={{
                width: CARD_W,
                height: CARD_H,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)",
                cursor: "pointer",
                background: "#111",
              }}
            >
              <img
                src={item.image}
                alt={item.text}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  userSelect: "none",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0";
                }}
              />
              {/* Label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "28px 14px 14px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 10,
                    fontFamily: "var(--font-body, 'Satoshi', sans-serif)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

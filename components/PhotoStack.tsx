"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTOS = [
  { image: "/pose.jpg",        label: "Arduino and joystick",                                                        rotate: -8,  top: 20, left: 5  },
  { image: "/UQ.jpg",          label: "My University!",                                                              rotate: 5,   top: 10, left: 28 },
  { image: "/nightlight.jpg",  label: "Creating a custom night light",                                               rotate: -3,  top: 25, left: 52 },
  { image: "/networking.jpg",  label: "International Science School 2025 gala reception",                            rotate: 9,   top: 5,  left: 72 },
  { image: "/biology.jpg",     label: "Analysing live fluke in cattle at The University of Sydney",                  rotate: -11, top: 48, left: 10 },
  { image: "/news.jpg",        label: "Being interviewed for WIN News at the Together for Humanity National Youth Summit", rotate: 4, top: 45, left: 35 },
  { image: "/news2.jpg",       label: "Discussing what it means to be living in a disconnected world",               rotate: -6,  top: 50, left: 60 },
  { image: "/diamondda40.jpg", label: "Flying a Diamond DA40 at RAAF Amberley as Airforce Cadet experience",        rotate: 10,  top: 68, left: 20 },
  { image: "/cadets.jpg",      label: "Airforce Cadets Bivouac",                                                     rotate: -4,  top: 72, left: 48 },
];

// Hue glow colours per card index
const HUE_LIGHT = ["#E04B52","#5FE0B3","#F2B632","#8C7AE6","#8FB7B8","#3A6EA5","#E04B52","#5FE0B3","#F2B632"];
const HUE_DARK  = ["#C6A85B","#0F8A5F","#3B1E3F","#D1D1D6","#C6A85B","#0F8A5F","#3B1E3F","#D1D1D6","#C6A85B"];

// CSS camera component
function PolaroidCamera({ isDark, scale = 1 }: { isDark: boolean; scale?: number }) {
  const accent = isDark ? "#C6A85B" : "#E04B52";
  const body   = isDark ? "#2A2A2A" : "#F5ECD7";
  const dark3  = isDark ? "#111"    : "#333";
  const dark6  = isDark ? "#444"    : "#666";
  const subtle = isDark ? "#3A3A3A" : "rgba(0,0,0,0.1)";
  const flashC = isDark ? "#3A3A3A" : "#E8D8C0";

  return (
    <div style={{
      width: 160 * scale,
      height: 140 * scale,
      borderRadius: 14 * scale,
      background: body,
      position: "relative",
      boxShadow: `0 ${8*scale}px ${32*scale}px rgba(0,0,0,0.28), 0 ${2*scale}px ${8*scale}px rgba(0,0,0,0.18)`,
      border: `${scale}px solid ${subtle}`,
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 12*scale, left: 12*scale, width: 28*scale, height: 16*scale, borderRadius: 4*scale, background: flashC, border: `${scale}px solid ${subtle}` }} />
      <div style={{ position: "absolute", top: 14*scale, right: 14*scale, width: 20*scale, height: 14*scale, borderRadius: 2*scale, background: dark3 }} />
      <div style={{ position: "absolute", top: "50%", left: 44*scale, transform: "translateY(-55%)", width: 52*scale, height: 52*scale, borderRadius: "50%", background: dark3, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 ${2*scale}px ${4*scale}px rgba(0,0,0,0.6)` }}>
        <div style={{ width: 38*scale, height: 38*scale, borderRadius: "50%", background: dark6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 24*scale, height: 24*scale, borderRadius: "50%", background: "#111", position: "relative" }}>
            <div style={{ position: "absolute", top: 4*scale, left: 6*scale, width: 5*scale, height: 5*scale, borderRadius: "50%", background: "rgba(255,255,255,0.65)" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: "50%", right: 14*scale, transform: "translateY(-55%)", width: 16*scale, height: 16*scale, borderRadius: "50%", background: accent, boxShadow: `0 ${2*scale}px ${6*scale}px rgba(0,0,0,0.35)` }} />
      <div style={{ position: "absolute", bottom: 20*scale, left: 0, right: 0, height: 4*scale, display: "flex" }}>
        {["#E04B52","#F2B632","#FFE566","#5FE0B3","#3A6EA5"].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 7*scale, left: "50%", transform: "translateX(-50%)", width: 68*scale, height: 4*scale, borderRadius: 2*scale, background: isDark ? "#111" : "rgba(0,0,0,0.3)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)" }} />
    </div>
  );
}

export default function PhotoStack() {
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Camera sequence state
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraY, setCameraY] = useState(-200);
  const [flashActive, setFlashActive] = useState(false);
  const [blankIdx, setBlankIdx] = useState<number | null>(null);
  const [visiblePhotos, setVisiblePhotos] = useState<boolean[]>(new Array(PHOTOS.length).fill(false));
  const [sequenceDone, setSequenceDone] = useState(false);
  const entrancePlayed = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const repelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Camera entrance sequence with improved animation
  const playSequence = useCallback(() => {
    if (entrancePlayed.current) return;
    entrancePlayed.current = true;

    // Camera descends from above
    setCameraVisible(true);
    setCameraY(-200);

    // After camera fades in, float it down
    setTimeout(() => setCameraY(0), 100);

    let t = 1400; // wait for camera to descend (1.2s animation + buffer)

    for (let i = 0; i < PHOTOS.length; i++) {
      const idx = i;
      // Flash
      setTimeout(() => { setFlashActive(true); }, t);
      setTimeout(() => { setFlashActive(false); }, t + 200);
      // Blank slides out
      setTimeout(() => { setBlankIdx(idx); }, t + 150);
      // Photo appears with flick animation
      setTimeout(() => {
        setBlankIdx(null);
        setVisiblePhotos(prev => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, t + 420);
      t += 600; // 0.6s stagger
    }

    // Camera floats back up and exits
    setTimeout(() => setCameraY(-280), t + 200);
    setTimeout(() => {
      setCameraVisible(false);
      setCameraY(-200);
      setTimeout(() => setSequenceDone(true), 450);
    }, t + 1000);
  }, []);

  // IntersectionObserver
  useEffect(() => {
    if (entrancePlayed.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        playSequence();
      },
      { threshold: 0.25 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [playSequence]);

  // Container tilt after sequence done
  useEffect(() => {
    if (!sequenceDone) return;
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      PHOTOS.forEach((photo, i) => {
        const el = tiltRefs.current[i];
        if (!el) return;
        const cx = (photo.left / 100) * rect.width + 65;
        const cy = (photo.top / 100) * rect.height + 80;
        const dx = mx - cx, dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 0) {
          const str = (1 - dist / 220) * 4;
          el.style.transform = `perspective(700px) rotateX(${((-dy / dist) * str).toFixed(2)}deg) rotateY(${((dx / dist) * str).toFixed(2)}deg)`;
        } else {
          el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
        }
      });
    };
    const onLeave = () => {
      tiltRefs.current.forEach(el => {
        if (el) el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
      });
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [sequenceDone]);

  // Cursor repel RAF
  useEffect(() => {
    if (!sequenceDone) return;
    let mouseX = -9999, mouseY = -9999, rafId = 0;
    const offs = PHOTOS.map(() => ({ cx: 0, cy: 0, tx: 0, ty: 0 }));
    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMove);

    function tick() {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        PHOTOS.forEach((photo, i) => {
          const el = repelRefs.current[i];
          if (!el) return;
          const cardX = rect.left + (photo.left / 100) * rect.width + 70;
          const cardY = rect.top + (photo.top / 100) * rect.height + 70;
          const dx = cardX - mouseX, dy = cardY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (1 - dist / 150) * 15;
            offs[i].tx = (dx / dist) * force;
            offs[i].ty = (dy / dist) * force;
          } else {
            offs[i].tx = 0; offs[i].ty = 0;
          }
          offs[i].cx += (offs[i].tx - offs[i].cx) * 0.06;
          offs[i].cy += (offs[i].ty - offs[i].cy) * 0.06;
          el.style.transform = `translate(${offs[i].cx.toFixed(2)}px,${offs[i].cy.toFixed(2)}px)`;
        });
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
    };
  }, [sequenceDone]);

  const photoW = isMobile ? "110px" : "var(--photo-w, 140px)";
  const camScale = isMobile ? 0.625 : 1;
  const frameBg = isDark ? "#2A2A2A" : "#FAFAFA";
  const frameBorder = isDark ? "2px solid #3A3A3A" : "2px solid #FFFFFF";
  const labelColor = isDark ? "#D1D1D6" : "#555";

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* Camera + flash group */}
      <AnimatePresence>
        {cameraVisible && (
          <motion.div
            className="pointer-events-none"
            style={{
              position: "absolute",
              left: "50%",
              top: "22%",
              transform: "translate(-50%, -50%)",
              zIndex: 90,
            }}
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: cameraY }}
            exit={{ opacity: 0, y: -280 }}
            transition={
              cameraY === -280
                ? { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
                : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <PolaroidCamera isDark={isDark} scale={camScale} />

            <AnimatePresence>
              {flashActive && (
                <motion.div
                  style={{
                    position: "absolute",
                    top: -8 * camScale,
                    left: -8 * camScale,
                    width: 44 * camScale,
                    height: 44 * camScale,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,220,0.98) 0%, rgba(255,240,120,0.6) 35%, transparent 70%)",
                    transformOrigin: "center center",
                    pointerEvents: "none",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 3, opacity: [0, 0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {blankIdx !== null && (
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: -(4 * camScale),
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 68 * camScale,
                    height: 88 * camScale,
                    background: isDark ? "#2A2A2A" : "#FAFAFA",
                    border: isDark ? "2px solid #3A3A3A" : "2px solid #FFFFFF",
                    borderRadius: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    zIndex: 95,
                    pointerEvents: "none",
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 52 * camScale, opacity: 1 }}
                  exit={{ y: 72 * camScale, opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photos */}
      {PHOTOS.map((photo, i) => {
        const hueColor = isDark ? HUE_DARK[i % HUE_DARK.length] : HUE_LIGHT[i % HUE_LIGHT.length];
        const isHovered = hoveredIdx === i;
        const otherHovered = hoveredIdx !== null && !isHovered;

        // Flick entrance: spin + scale up
        const flickInitial = {
          opacity: 0,
          rotate: photo.rotate + 360 + (i % 2 === 0 ? 180 : -180),
          scale: 0.3,
          x: 0,
          y: 0,
        };
        const flickAnimate = visiblePhotos[i]
          ? { opacity: 1, rotate: photo.rotate, scale: 1, x: 0, y: 0 }
          : flickInitial;

        return (
          <div
            key={i}
            ref={(el) => { repelRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: `${photo.top}%`,
              left: `${photo.left}%`,
              zIndex: isHovered ? 999 : 10,
            }}
          >
            <div
              ref={(el) => { tiltRefs.current[i] = el; }}
              style={{ transition: "transform 0.15s ease" }}
            >
              <motion.div
                initial={flickInitial}
                animate={flickAnimate}
                transition={
                  visiblePhotos[i]
                    ? { type: "spring", stiffness: 200, damping: 15, duration: 0.8 }
                    : { duration: 0 }
                }
                whileHover={
                  sequenceDone
                    ? { y: -12, scale: 1.4, transition: { type: "spring", stiffness: 300, damping: 20 } }
                    : {}
                }
                onHoverStart={() => sequenceDone && setHoveredIdx(i)}
                onHoverEnd={() => sequenceDone && setHoveredIdx(null)}
                style={{
                  cursor: sequenceDone ? "pointer" : "default",
                  opacity: otherHovered ? 0.7 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                {/* Hue glow */}
                {isHovered && (
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: -8,
                      borderRadius: 16,
                      background: hueColor,
                      opacity: 0.35,
                      filter: "blur(20px)",
                      zIndex: -1,
                      pointerEvents: "none",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}

                <div style={{
                  width: photoW,
                  padding: 6,
                  background: frameBg,
                  border: frameBorder,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)",
                  borderRadius: 2,
                }}>
                  <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: isDark ? "#1A1A1A" : "#E0E0E0" }}>
                    <img
                      src={photo.image}
                      alt={photo.label}
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", userSelect: "none" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                    />
                  </div>
                  <p style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: 12,
                    color: labelColor,
                    textAlign: "center",
                    margin: "6px 0 2px",
                    lineHeight: 1,
                  }}>
                    {photo.label}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

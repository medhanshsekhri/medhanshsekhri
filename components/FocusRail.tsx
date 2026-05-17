"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "./Modal";

const CARD_W = 320;
const CARD_H = 420;
const CARD_GAP = 24;
const CARD_STEP = CARD_W + CARD_GAP;
const AUTO_SPEED = 0.4;
const LERP_FACTOR = 0.08;

interface Project {
  id: number;
  title: string;
  description: string;
  meta: string;
  imageSrc: string | null;
  gradient?: string;
  watermark?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Flood-Resistant Station-Keeping House",
    description: "ENGG1100, UQ. Team leader across structural, electrical and software subsystems within a $170 AUD budget.",
    meta: "University Project",
    imageSrc: null,
    gradient: "linear-gradient(135deg, #0a1628, #1a3a5c, #0d2137)",
  },
  {
    id: 2,
    title: "Autonomous Radar Scanner",
    description: "Real-time 180 degree object detection built from scratch. The sensing foundation of an autonomous drone.",
    meta: "Personal Development",
    imageSrc: "/frontview.jpg",
  },
  {
    id: 3,
    title: "Autonomous Obstacle-Dodging Drone",
    description: "A hovering drone that detects and dodges moving objects in real time. Built from first principles.",
    meta: "Personal Development",
    imageSrc: null,
    gradient: "linear-gradient(135deg, #020408, #0a0f1e, #060b18)",
    watermark: true,
  },
  {
    id: 4,
    title: "CO2 Dragster",
    description: "45g, 0.49s over 1m. Designed in Fusion 360. Placed top 5 in year group.",
    meta: "High School Projects",
    imageSrc: "/dragster.jpg",
  },
  {
    id: 5,
    title: "Model Rocket",
    description: "97m apogee. B6-4 motor. Designed in OpenRocket, built and launched safely.",
    meta: "High School Projects",
    imageSrc: "/rocket.jpg",
  },
  {
    id: 6,
    title: "Balsa Truss Tower",
    description: "Structural efficiency competition. Designed to maximise load-to-weight ratio using truss geometry.",
    meta: "High School Projects",
    imageSrc: "/tower_side.jpg",
  },
  {
    id: 7,
    title: "Autonomous Warehouse Rover",
    description: "LEGO Mindstorms rover programmed to navigate an obstacle course autonomously using sensor feedback.",
    meta: "High School Projects",
    imageSrc: "/rover_front.jpg",
  },
];

// Per-card colored borders (cycling through palette)
const CARD_BORDERS_LIGHT = ["#8FB7B8","#E04B52","#8C7AE6","#F2B632","#3A6EA5","#5FE0B3","#8FB7B8"];
const CARD_BORDERS_DARK  = ["#C6A85B","#0F8A5F","#9B5FC0","#C6A85B","#3A6EA5","#C6A85B","#0F8A5F"];

const n = PROJECTS.length;
const TOTAL_SET_W = n * CARD_STEP;
const DISPLAY_CARDS = [...PROJECTS, ...PROJECTS, ...PROJECTS];

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body font-medium bg-surface border border-border text-muted">
      {label}
    </span>
  );
}

function ProjectModalContent({ id }: { id: number }) {
  if (id === 1) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">University Project</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Flood-Resistant Station-Keeping House</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">
          ENGG1100, The University of Queensland. Team leader across structural, electrical, and software subsystems within a $170 AUD budget.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Challenge", body: "Coordinating a team of four across disciplines with no prior experience. Keeping the project on budget while meeting all structural and electrical constraints." },
            { heading: "What I Did", body: "Led the team, delegated tasks, and personally owned the electrical and firmware subsystems. Designed the motor control circuit and wrote the Arduino navigation code." },
            { heading: "Result", body: "A flood-resistant, station-keeping house that held position under simulated flood conditions. Delivered under budget with all subsystems functional." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {["Arduino UNO", "C++", "L298N H-Bridge", "12V DC Motors", "3D Printing", "Tinkercad", "XPS Foam", "Corflute"].map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
        <p className="text-muted text-sm font-body italic">Photos and video coming soon.</p>
      </div>
    );
  }

  if (id === 2) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">Personal Development</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Radar Scanner</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">
          Real-time 180 degree object detection built from scratch. The sensing foundation of an autonomous drone.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Challenge", body: "Debugging embedded hardware with no prior experience. Staying methodical when nothing worked and every path seemed like a dead end." },
            { heading: "What I Did", body: "Taught myself C++ from scratch. Wrote all sweep and detection logic. Resolved a critical servo mounting failure using cardboard and Blu-Tack. Built a live radar visualisation UI in Processing." },
            { heading: "Result", body: "Fully functioning radar scanner with live UI. Real-time object mapping at 180 degrees. Code is public on GitHub." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {["Arduino UNO", "C++", "HC-SR04", "SG90 Servo", "Processing", "Embedded Systems"].map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {["frontview.jpg", "topview.jpg", "sideview.jpg", "topview2.jpg"].map((img) => (
            <div key={img} className="aspect-square rounded-xl overflow-hidden bg-surface border border-border">
              <img src={`/${img}`} alt={img.replace(".jpg","").replace(/_/g," ")} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          ))}
        </div>
        <div className="mb-10">
          <div className="rounded-xl overflow-hidden mb-4" style={{ background: "#000" }}>
            <video controls muted playsInline style={{ width: "100%", height: 400, objectFit: "contain", background: "#000", display: "block" }}>
              <source src="/video1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="rounded-xl overflow-hidden bg-surface border border-border flex items-center justify-center p-4" style={{ height: 200 }}>
            <img src="/circuit_image.png" alt="Circuit diagram" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        </div>
        <a href="https://github.com/medhanshsekhri/Arduino-Radar-Scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-white text-sm font-body font-semibold hover:opacity-90 transition-opacity">
          View on GitHub
        </a>
      </div>
    );
  }

  if (id === 3) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">Personal Development &middot; In Progress</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Obstacle-Dodging Drone</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">A hovering drone that detects and dodges moving objects in real time. Built from first principles.</p>
        <div className="border-l-2 border-accent pl-6 mb-10">
          <p className="font-display text-2xl text-text italic leading-snug">&ldquo;The radar scanner was the proof of concept. This is the mission.&rdquo;</p>
        </div>
        <p className="text-muted font-body text-sm leading-relaxed mb-8">
          The radar scanner established the detection layer. The drone is the next step: a platform that uses real-time sensor data to navigate autonomously around moving obstacles. Currently in the design and component selection phase.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Flight Controller", "Ultrasonic Sensing", "C++", "PID Control", "In Development"].map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
      </div>
    );
  }

  if (id === 4) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School Projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">CO2 Dragster</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">45g, 0.49s over 1m. Designed in Fusion 360, CNC machined from balsa wood. Placed top 5 in year group.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Design", body: "Full car designed in Fusion 360. Optimised for aerodynamics and minimum frontal area within competition constraints." },
            { heading: "Build", body: "Hand-finished and sanded from balsa wood. Weighted and balanced to hit the 45g target." },
            { heading: "Result", body: "0.49 seconds over 1 metre. Placed top 5 in year group. Outperformed heavier designs through aerodynamic efficiency." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {["Fusion 360", "Balsa Wood", "Aerodynamics", "CAD"].map((t) => (<TechPill key={t} label={t} />))}
        </div>
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden mb-3" style={{ background: "#000" }}>
            <video controls muted playsInline style={{ width: "100%", height: 360, objectFit: "contain", background: "#000", display: "block" }}>
              <source src="/dragster_video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ height: 200, background: "var(--dragster-img-bg, #f5f5f5)", padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/dragster.jpg" alt="CO2 Dragster" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        </div>
      </div>
    );
  }

  if (id === 5) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School Projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Model Rocket</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">97m apogee. B6-4 motor. Designed in OpenRocket, built and launched safely.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Design", body: "Designed in OpenRocket. Simulated flight trajectory and stability margin before construction. B6-4 motor selected for optimal apogee." },
            { heading: "Build", body: "Built from a kit with custom fin alignment. Balanced and verified stable before launch. Recovery system tested and deployed." },
            { heading: "Result", body: "Successful launch to 97m apogee. Stable flight, clean recovery. A working physical simulation of aerospace principles." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {["OpenRocket", "B6-4 Motor", "Flight Dynamics", "Recovery Systems"].map((t) => (<TechPill key={t} label={t} />))}
        </div>
        <div className="mb-8">
          <video controls muted playsInline style={{ width: "100%", height: 420, objectFit: "contain", borderRadius: 8, marginBottom: 8, background: "#000", display: "block" }}>
            <source src="/rocket_video.mp4" type="video/mp4" />
          </video>
          <img src="/rocket.jpg" alt="Model Rocket" style={{ width: "100%", borderRadius: 8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      </div>
    );
  }

  if (id === 6) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School Projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Balsa Truss Tower</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">Structural efficiency competition. Designed to maximise load-to-weight ratio using truss geometry.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Approach", body: "Applied truss geometry principles to minimise material use while maximising load capacity. Joints designed for direct load paths." },
            { heading: "Build", body: "Cut and assembled from balsa strip stock. Joints pinned and glued with careful weight tracking throughout construction." },
            { heading: "Result", body: "Competitive load-to-weight ratio in class testing. Failure mode was predictable and occurred at the designed weak point." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {["Truss Design", "Balsa Wood", "Structural Analysis", "Load Testing"].map((t) => (<TechPill key={t} label={t} />))}
        </div>
        <p className="text-muted font-body text-sm leading-relaxed mb-8">
          Structural analysis focused on moments at joints, static equilibrium, tension and compression forces throughout the truss members. Each joint was analysed to determine force distribution and optimise the structure for maximum load efficiency with minimum material.
        </p>
        <div style={{ display: "flex", gap: 12, overflowY: "auto" }}>
          <img src="/tower_top.jpg" alt="Balsa Truss Tower Top View" style={{ flex: 1, height: 260, objectFit: "cover", borderRadius: 8, minWidth: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <img src="/tower_side.jpg" alt="Balsa Truss Tower Side View" style={{ flex: 1, height: 260, objectFit: "cover", borderRadius: 8, minWidth: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      </div>
    );
  }

  if (id === 7) {
    return (
      <div>
        <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School Projects</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Warehouse Rover</h2>
        <p className="text-muted font-body text-base leading-relaxed mb-10">LEGO Mindstorms EV3 rover programmed to navigate an obstacle course autonomously using sensor feedback.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { heading: "Task", body: "Navigate a warehouse-style obstacle course without human input. Detect, classify, and respond to obstacles using onboard sensors." },
            { heading: "Approach", body: "Programmed in EV3-G with custom sensor logic. Ultrasonic sensor for obstacle detection, colour sensor for line following and zone identification." },
            { heading: "Result", body: "Completed the full course autonomously. Demonstrated sensor fusion and conditional decision-making in a physical environment." },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {["LEGO Mindstorms EV3", "EV3-G", "Ultrasonic Sensor", "Colour Sensor", "Autonomous Navigation"].map((t) => (<TechPill key={t} label={t} />))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <img src="/rover_front.jpg" alt="Rover Front View" style={{ maxHeight: 200, width: "auto", objectFit: "contain", borderRadius: 8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <img src="/rover_side_.jpg" alt="Rover Side View" style={{ maxHeight: 200, width: "auto", objectFit: "contain", borderRadius: 8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      </div>
    );
  }

  return null;
}

export default function FocusRail() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalId, setModalId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollRef = useRef(-TOTAL_SET_W);
  const targetRef = useRef(-TOTAL_SET_W);
  const pausedRef = useRef(false);
  const rafRef = useRef(0);
  const prevActiveRef = useRef(-1);

  // Dark mode detection
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const computeActive = useCallback((offset: number): number => {
    const cw = containerRef.current?.clientWidth ?? 800;
    const viewCenter = cw / 2;
    const iFloat = (viewCenter - CARD_W / 2 - offset) / CARD_STEP;
    return (((Math.round(iFloat) % n) + n) % n);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function tick() {
      if (!pausedRef.current) targetRef.current -= AUTO_SPEED;
      scrollRef.current += (targetRef.current - scrollRef.current) * LERP_FACTOR;

      while (scrollRef.current <= -2 * TOTAL_SET_W) {
        scrollRef.current += TOTAL_SET_W;
        targetRef.current += TOTAL_SET_W;
      }
      while (scrollRef.current > 0) {
        scrollRef.current -= TOTAL_SET_W;
        targetRef.current -= TOTAL_SET_W;
      }

      if (track) track.style.transform = `translateX(${scrollRef.current}px)`;

      const newActive = computeActive(scrollRef.current);
      if (newActive !== prevActiveRef.current) {
        prevActiveRef.current = newActive;
        setActiveIndex(newActive);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [computeActive]);

  const handlePrev = useCallback(() => { targetRef.current += CARD_STEP; }, []);
  const handleNext = useCallback(() => { targetRef.current -= CARD_STEP; }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (modalId !== null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev, modalId]);

  const activeProject = PROJECTS[activeIndex];

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 overflow-hidden bg-transparent">
      {/* Background ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {activeProject.imageSrc ? (
            <motion.div key={`amb-img-${activeProject.id}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              <img src={activeProject.imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(70px)", transform: "scale(1.3)", opacity: 0.1 }} />
            </motion.div>
          ) : (
            <motion.div key={`amb-g-${activeProject.id}`} className="absolute inset-0" style={{ background: activeProject.gradient, filter: "blur(70px)", transform: "scale(1.3)" }} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} />
          )}
        </AnimatePresence>
      </div>

      {/* Heading */}
      <motion.div className="relative z-10 text-center mb-16 px-6" initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
        <h2 className="font-display font-semibold text-text" style={{ fontSize: "clamp(4.5rem, 8vw, 7rem)", lineHeight: 1 }}>
          Projects<span className="text-[#E04B52] dark:text-[#C6A85B]">.</span><span className="animate-blink text-[#E04B52] dark:text-[#C6A85B]">|</span>
        </h2>
        <p className="text-muted font-body text-sm mt-4">Click any card to explore.</p>
      </motion.div>

      {/* Conveyor belt */}
      <div
        ref={containerRef}
        className="relative z-10"
        style={{ height: CARD_H + 48, paddingTop: 12, paddingBottom: 12, overflowX: "clip", overflowY: "visible" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div
          ref={trackRef}
          className="absolute top-3 left-0 flex"
          style={{ gap: CARD_GAP, willChange: "transform" }}
        >
          {DISPLAY_CARDS.map((project, index) => {
            const origIdx = index % n;
            const rawDist = Math.abs(origIdx - activeIndex);
            const distance = Math.min(rawDist, n - rawDist);

            let scaleVal: number;
            let filterVal: string;
            if (distance === 0) { scaleVal = 1.04; filterVal = "none"; }
            else if (distance === 1) { scaleVal = 0.95; filterVal = "blur(1px) brightness(0.85)"; }
            else if (distance === 2) { scaleVal = 0.88; filterVal = "blur(2.5px) brightness(0.7)"; }
            else { scaleVal = 0.84; filterVal = "blur(4px) brightness(0.55)"; }

            const borderColor = isDark
              ? CARD_BORDERS_DARK[(project.id - 1) % CARD_BORDERS_DARK.length]
              : CARD_BORDERS_LIGHT[(project.id - 1) % CARD_BORDERS_LIGHT.length];

            const cardBg = isDark ? "rgba(26,26,26,0.96)" : "rgba(255,255,255,0.94)";

            return (
              <div
                key={`${project.id}-${Math.floor(index / n)}`}
                className="relative rounded-2xl shrink-0 cursor-pointer"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  background: cardBg,
                  backdropFilter: "blur(12px) saturate(120%)",
                  transform: `scale(${scaleVal})`,
                  filter: filterVal,
                  transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease",
                  border: `2px solid ${borderColor}`,
                  boxShadow: distance === 0
                    ? `inset 0 0 40px ${borderColor}18`
                    : "none",
                }}
                onClick={() => setModalId(project.id)}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width * 2 - 1;
                  const y = (e.clientY - rect.top) / rect.height * 2 - 1;
                  card.style.transform = `scale(${scaleVal}) perspective(800px) rotateX(${(-y * 8).toFixed(1)}deg) rotateY(${(x * 8).toFixed(1)}deg)`;
                  card.style.transition = "filter 0.2s ease";
                  const shimmer = card.querySelector(".shimmer-hl") as HTMLDivElement | null;
                  if (shimmer) shimmer.style.background = `radial-gradient(220px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.07) 0%, transparent 70%)`;
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = `scale(${scaleVal})`;
                  card.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease";
                  const shimmer = card.querySelector(".shimmer-hl") as HTMLDivElement | null;
                  if (shimmer) shimmer.style.background = "transparent";
                }}
              >
                {/* Image window */}
                <div style={{ margin: 12, height: 180, borderRadius: 10, overflow: "hidden", background: isDark ? "#111" : "#e8e8e8", position: "relative" }}>
                  {project.imageSrc ? (
                    <img src={project.imageSrc} alt={project.title} className="w-full h-full object-cover" draggable={false} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : project.watermark ? (
                    <div style={{ width: "100%", height: "100%", background: project.gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 16px" }}>
                      <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.18)", letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.1, userSelect: "none" }}>In Production</p>
                      <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", userSelect: "none" }}>Autonomous Obstacle-Dodging Drone</p>
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: project.gradient }} />
                  )}
                  {/* Shimmer on image */}
                  <div
                    className="shimmer-hl"
                    style={{ position: "absolute", inset: 0, background: "transparent", pointerEvents: "none" }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "12px 18px 18px" }}>
                  <p
                    className="text-[10px] uppercase tracking-widest font-body mb-2"
                    style={{ color: borderColor, opacity: 0.7 }}
                  >
                    {project.meta}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-text leading-tight mb-2">{project.title}</h3>
                  <p className="text-muted text-xs font-body leading-relaxed">{project.description}</p>
                </div>

                {distance === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="text-muted/40 text-[10px] font-body tracking-wide">click to explore</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows + dots */}
      <div className="relative z-10 flex items-center justify-center gap-4 mt-6 px-6">
        <button onClick={handlePrev} className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-all duration-200" aria-label="Previous">
          <ChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-2">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { targetRef.current -= (i - activeIndex) * CARD_STEP; }}
              className={`rounded-full transition-all duration-300 ${i === activeIndex ? "bg-accent w-6 h-1.5" : "bg-muted/40 w-1.5 h-1.5 hover:bg-muted/70"}`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={handleNext} className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-all duration-200" aria-label="Next">
          <ChevronRight size={14} />
        </button>
      </div>

      <Modal isOpen={modalId !== null} onClose={() => setModalId(null)}>
        {modalId !== null && <ProjectModalContent id={modalId} />}
      </Modal>
    </section>
  );
}

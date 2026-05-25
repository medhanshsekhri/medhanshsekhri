"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Modal from "./Modal";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

interface Project {
  id: number;
  title: string;
  description: string;
  meta: string;
  imageSrc: string | null;
  solidBg?: string;
  watermark?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Flood-Resistant Station-Keeping House",
    description: "ENGG1100, UQ. Team leader across structural, electrical and software subsystems within a $170 AUD budget.",
    meta: "University Project",
    imageSrc: null,
    solidBg: "#1a3a5c",
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
    solidBg: "#0a0f1e",
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
              <img src={`/${img}`} alt={img.replace(".jpg", "").replace(/_/g, " ")} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
          Structural analysis focused on moments at joints, static equilibrium, tension and compression forces throughout the truss members.
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

// 3×3 bento layout: 7 projects + GitHub + contact CTA
const BENTO_LAYOUT = [
  { row: 0, col: 0, type: "project" as const, projectId: 1 },
  { row: 0, col: 1, type: "project" as const, projectId: 2 },
  { row: 0, col: 2, type: "project" as const, projectId: 3 },
  { row: 1, col: 0, type: "project" as const, projectId: 4 },
  { row: 1, col: 1, type: "project" as const, projectId: 5 },
  { row: 1, col: 2, type: "project" as const, projectId: 6 },
  { row: 2, col: 0, type: "project" as const, projectId: 7 },
  { row: 2, col: 1, type: "github" as const },
  { row: 2, col: 2, type: "contact" as const },
];

export default function BentoProjects() {
  const [modalId, setModalId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    gsap.registerPlugin(Flip);

    const bentoContainer = containerRef.current;
    if (!bentoContainer || window.innerWidth < 768) return;

    const bentoItems = bentoContainer.querySelectorAll("[data-row]");
    const rowClasses = ["rows-3-1-1", "rows-1-3-1", "rows-1-1-3"];
    const colClasses = ["cols-3-1-1", "cols-1-3-1", "cols-1-1-3"];
    let activeColumn = 1, activeRow = 1, doFlip = false;

    const handlers: { el: Element; fn: EventListener }[] = [];

    bentoItems.forEach((e) => {
      const colNumber = parseInt(e.getAttribute("data-column") ?? "1");
      const rowNumber = parseInt(e.getAttribute("data-row") ?? "1");

      const fn = () => {
        const state = Flip.getState(bentoItems);
        if (colNumber !== activeColumn) {
          bentoContainer.classList.remove(colClasses[activeColumn]);
          bentoContainer.classList.add(colClasses[colNumber]);
          activeColumn = colNumber;
          doFlip = true;
        }
        if (rowNumber !== activeRow) {
          bentoContainer.classList.remove(rowClasses[activeRow]);
          bentoContainer.classList.add(rowClasses[rowNumber]);
          activeRow = rowNumber;
          doFlip = true;
        }
        if (doFlip) {
          Flip.from(state, {
            duration: 0.4,
            ease: "power2.out",
            onStart: () => { doFlip = false; },
            absolute: true,
          });
        }
      };

      e.addEventListener("mouseenter", fn);
      handlers.push({ el: e, fn: fn as EventListener });
    });

    const leaveHandler = () => {
      doFlip = true;
      const state = Flip.getState(bentoItems);
      bentoContainer.classList.remove(colClasses[activeColumn]);
      bentoContainer.classList.remove(rowClasses[activeRow]);
      bentoContainer.classList.add(colClasses[1]);
      bentoContainer.classList.add(rowClasses[1]);
      activeColumn = 1;
      activeRow = 1;
      Flip.from(state, {
        duration: 0.4,
        ease: "power2.out",
        onStart: () => { doFlip = false; },
        absolute: true,
      });
    };

    bentoContainer.addEventListener("mouseleave", leaveHandler);

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("mouseenter", fn));
      bentoContainer.removeEventListener("mouseleave", leaveHandler);
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 px-6">
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h2
          className="font-display font-semibold text-text"
          style={{ fontSize: "clamp(4.5rem, 8vw, 7rem)", lineHeight: 1 }}
        >
          Projects<span className="text-[#E04B52] dark:text-[#C6A85B]">.</span>
          <span className="animate-blink text-[#E04B52] dark:text-[#C6A85B]">|</span>
        </h2>
        <p className="text-muted font-body text-sm mt-4">Hover to expand. Click to go deeper.</p>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        ref={containerRef}
        className="bento-container cols-1-3-1 rows-1-3-1 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {BENTO_LAYOUT.map((cell) => {
          if (cell.type === "project") {
            const project = PROJECTS.find((p) => p.id === cell.projectId)!;

            return (
              <div
                key={`${cell.row}-${cell.col}`}
                data-row={cell.row}
                data-column={cell.col}
                className="bento-item relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
                onClick={() => setModalId(project.id)}
              >
                {/* Background */}
                <div className="absolute inset-0">
                  {project.imageSrc ? (
                    <img
                      src={project.imageSrc}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : project.watermark ? (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-2 px-4"
                      style={{ background: project.solidBg }}
                    >
                      <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.15)", textAlign: "center", lineHeight: 1.1, userSelect: "none" }}>
                        In Production
                      </p>
                      <p style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", userSelect: "none" }}>
                        Obstacle-Dodging Drone
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full" style={{ background: project.solidBg }} />
                  )}
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-body mb-1">
                    {project.meta}
                  </p>
                  <h3 className="text-white font-display font-semibold text-base leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-xs font-body leading-relaxed mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Hover hint */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white/70 text-[10px] font-body bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    explore →
                  </span>
                </div>
              </div>
            );
          }

          if (cell.type === "github") {
            return (
              <a
                key={`${cell.row}-${cell.col}`}
                data-row={cell.row}
                data-column={cell.col}
                href="https://github.com/medhanshsekhri"
                target="_blank"
                rel="noopener noreferrer"
                className="bento-item relative overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-3 group border border-border bg-surface hover:border-accent transition-colors duration-300"
                style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-muted group-hover:text-accent transition-colors duration-300" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="text-text font-body font-semibold text-sm group-hover:text-accent transition-colors duration-300">
                  GitHub
                </span>
                <span className="text-muted text-xs font-body">View all projects</span>
              </a>
            );
          }

          if (cell.type === "contact") {
            return (
              <a
                key={`${cell.row}-${cell.col}`}
                data-row={cell.row}
                data-column={cell.col}
                href="#contact"
                className="bento-item relative overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-3 group border border-border bg-surface hover:border-accent transition-colors duration-300"
                style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="text-text font-body font-semibold text-sm group-hover:text-accent transition-colors duration-300">
                  Get in Touch
                </span>
                <span className="text-muted text-xs font-body">Let&apos;s build something</span>
              </a>
            );
          }

          return null;
        })}
      </motion.div>

      <Modal isOpen={modalId !== null} onClose={() => setModalId(null)}>
        {modalId !== null && <ProjectModalContent id={modalId} />}
      </Modal>
    </section>
  );
}

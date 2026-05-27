"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Modal from "./Modal";

interface Project {
  id: number;
  title: string;
  meta: string;
  imageSrc: string | null;
  noImageBg?: string;
}

const PROJECTS: Project[] = [
  { id: 2, title: "Autonomous Radar Scanner",             meta: "Personal Project",   imageSrc: "/frontview.jpg" },
  { id: 1, title: "Flood-Resistant Station-Keeping House",meta: "University Project",  imageSrc: null },
  { id: 3, title: "Autonomous Obstacle-Dodging Drone",    meta: "In Progress",         imageSrc: null, noImageBg: "#0a0f1e" },
  { id: 4, title: "CO2 Dragster",                         meta: "High School",         imageSrc: "/dragster.jpg" },
  { id: 5, title: "Model Rocket",                         meta: "High School",         imageSrc: "/rocket.jpg" },
  { id: 6, title: "Balsa Truss Tower",                    meta: "High School",         imageSrc: "/tower_side.jpg" },
  { id: 7, title: "Autonomous Warehouse Rover",           meta: "High School",         imageSrc: "/rover_front.jpg" },
];

// Desktop mosaic positions — 3 col × 3 row grid
// Row heights: 320px 200px 240px   Gap: 12px
const DESKTOP: Record<number, { col: string; row: string }> = {
  2: { col: "1",     row: "1 / 3" }, // Radar — tall, spans rows 1+2
  1: { col: "2",     row: "1"     }, // House — top middle
  3: { col: "3",     row: "1"     }, // Drone — top right
  4: { col: "2 / 4", row: "2"     }, // Dragster — wide, spans cols 2+3
  5: { col: "1",     row: "3"     }, // Rocket
  6: { col: "2",     row: "3"     }, // Tower
  7: { col: "3",     row: "3"     }, // Rover
};

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted">
      {label}
    </span>
  );
}

function ProjectModalContent({ id }: { id: number }) {
  if (id === 1) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">University Project</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Flood-Resistant Station-Keeping House</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">ENGG1100, The University of Queensland. Team leader across structural, electrical, and software subsystems within a $170 AUD budget.</p>
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
        {["Arduino UNO", "C++", "L298N H-Bridge", "12V DC Motors", "3D Printing", "Tinkercad", "XPS Foam", "Corflute"].map((t) => <TechPill key={t} label={t} />)}
      </div>
      <p className="text-muted text-sm font-body italic">Photos and video coming soon.</p>
    </div>
  );

  if (id === 2) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">Personal Project</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Radar Scanner</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">Real-time 180° object detection built from scratch. The sensing foundation of an autonomous drone.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Challenge", body: "Debugging embedded hardware with no prior experience. Staying methodical when nothing worked and every path seemed like a dead end." },
          { heading: "What I Did", body: "Taught myself C++ from scratch. Wrote all sweep and detection logic. Resolved a critical servo mounting failure. Built a live radar visualisation UI in Processing." },
          { heading: "Result", body: "Fully functioning radar scanner with live UI. Real-time object mapping at 180°. Code is public on GitHub." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {["Arduino UNO", "C++", "HC-SR04", "SG90 Servo", "Processing", "Embedded Systems"].map((t) => <TechPill key={t} label={t} />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {["frontview.jpg","topview.jpg","sideview.jpg","topview2.jpg"].map((img) => (
          <div key={img} className="aspect-square rounded-lg overflow-hidden border border-border">
            <img src={`/${img}`} alt={img.replace(".jpg","").replace(/_/g," ")} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
          </div>
        ))}
      </div>
      <div className="mb-10">
        <div className="rounded-lg overflow-hidden mb-4 border border-border">
          <video controls muted playsInline style={{width:"100%",height:380,objectFit:"contain",background:"#000",display:"block"}}>
            <source src="/video1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-lg overflow-hidden border border-border flex items-center justify-center p-4" style={{height:200}}>
          <img src="/circuit_image.png" alt="Circuit diagram" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        </div>
      </div>
      <a href="https://github.com/medhanshsekhri/Arduino-Radar-Scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded">
        View on GitHub ↗
      </a>
    </div>
  );

  if (id === 3) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">Personal Project · In Progress</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Obstacle-Dodging Drone</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">A hovering drone that detects and dodges moving objects in real time. Built from first principles.</p>
      <div className="border-l-2 border-border pl-6 mb-10">
        <p className="font-display text-2xl text-text italic leading-snug">&ldquo;The radar scanner was the proof of concept. This is the mission.&rdquo;</p>
      </div>
      <p className="text-muted font-body text-sm leading-relaxed mb-8">The radar scanner established the detection layer. The drone is the next step: a platform that uses real-time sensor data to navigate autonomously around moving obstacles. Currently in the design and component selection phase.</p>
      <div className="flex flex-wrap gap-2">
        {["Flight Controller","Ultrasonic Sensing","C++","PID Control","In Development"].map((t) => <TechPill key={t} label={t} />)}
      </div>
    </div>
  );

  if (id === 4) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School</p>
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
      <div className="flex flex-wrap gap-2 mb-10">{["Fusion 360","Balsa Wood","Aerodynamics","CAD"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden mb-3 border border-border">
          <video controls muted playsInline style={{width:"100%",height:340,objectFit:"contain",background:"#000",display:"block"}}>
            <source src="/dragster_video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-lg overflow-hidden border border-border" style={{height:200,background:"var(--dragster-img-bg,#f5f5f5)",padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="/dragster.jpg" alt="CO2 Dragster" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        </div>
      </div>
    </div>
  );

  if (id === 5) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Model Rocket</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">97m apogee. B6-4 motor. Designed in OpenRocket, built and launched safely.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Design", body: "Designed in OpenRocket. Simulated flight trajectory and stability margin before construction." },
          { heading: "Build", body: "Built from a kit with custom fin alignment. Balanced and verified stable before launch. Recovery system tested and deployed." },
          { heading: "Result", body: "Successful launch to 97m apogee. Stable flight, clean recovery." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["OpenRocket","B6-4 Motor","Flight Dynamics","Recovery Systems"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div className="mb-8">
        <video controls muted playsInline style={{width:"100%",height:400,objectFit:"contain",borderRadius:8,marginBottom:8,background:"#000",display:"block"}}>
          <source src="/rocket_video.mp4" type="video/mp4" />
        </video>
        <img src="/rocket.jpg" alt="Model Rocket" style={{width:"100%",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  if (id === 6) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Balsa Truss Tower</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">Structural efficiency competition. Designed to maximise load-to-weight ratio using truss geometry.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Approach", body: "Applied truss geometry principles to minimise material use while maximising load capacity." },
          { heading: "Build", body: "Cut and assembled from balsa strip stock. Joints pinned and glued with careful weight tracking." },
          { heading: "Result", body: "Competitive load-to-weight ratio in class testing. Failure mode was predictable and at the designed weak point." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["Truss Design","Balsa Wood","Structural Analysis","Load Testing"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div style={{display:"flex",gap:12}}>
        <img src="/tower_top.jpg" alt="Tower top" style={{flex:1,height:260,objectFit:"cover",borderRadius:8,minWidth:0}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        <img src="/tower_side.jpg" alt="Tower side" style={{flex:1,height:260,objectFit:"cover",borderRadius:8,minWidth:0}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  if (id === 7) return (
    <div>
      <p className="text-muted text-xs uppercase tracking-widest font-body mb-2">High School</p>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Warehouse Rover</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">LEGO Mindstorms EV3 rover programmed to navigate an obstacle course autonomously using sensor feedback.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Task", body: "Navigate a warehouse-style obstacle course without human input using onboard sensors." },
          { heading: "Approach", body: "Programmed in EV3-G. Ultrasonic sensor for obstacle detection, colour sensor for line following." },
          { heading: "Result", body: "Completed the full course autonomously. Demonstrated sensor fusion and conditional decision-making." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["LEGO Mindstorms EV3","EV3-G","Ultrasonic Sensor","Colour Sensor","Autonomous Navigation"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <img src="/rover_front.jpg" alt="Rover front" style={{maxHeight:200,width:"auto",objectFit:"contain",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        <img src="/rover_side_.jpg" alt="Rover side" style={{maxHeight:200,width:"auto",objectFit:"contain",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  return null;
}

function Tile({ project, onClick, className, style }: {
  project: Project;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group cursor-pointer focus:outline-none ${className ?? ""}`}
      style={style}
      aria-label={`Open ${project.title}`}
    >
      {/* Background */}
      {project.imageSrc ? (
        <img
          src={project.imageSrc}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          draggable={false}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div
          className="absolute inset-0 border border-border"
          style={{ background: project.noImageBg ?? "var(--clr-surface)" }}
        />
      )}

      {/* Hover overlay — title + arrow fade in */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-4">
        <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-body mb-0.5">
            {project.meta}
          </p>
          <p className="text-white font-display font-semibold leading-tight text-sm md:text-base">
            {project.title} <span className="font-body font-normal">↗</span>
          </p>
        </div>
      </div>
    </button>
  );
}

export default function Projects() {
  const [modalId, setModalId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-display font-semibold text-text"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Projects<span className="text-accent">.</span>
          </h2>
          <p className="text-muted font-body text-sm mt-2">Hover to preview. Click to explore.</p>
        </motion.div>

        {/* ── Desktop mosaic: 3 col × 3 row ── */}
        <motion.div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "320px 200px 240px",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {PROJECTS.map((project) => {
            const pos = DESKTOP[project.id];
            return (
              <Tile
                key={project.id}
                project={project}
                onClick={() => setModalId(project.id)}
                style={{ gridColumn: pos.col, gridRow: pos.row }}
              />
            );
          })}
        </motion.div>

        {/* ── Mobile: 2-col uniform grid ── */}
        <motion.div
          className="grid md:hidden grid-cols-2 gap-3"
          style={{ gridAutoRows: "200px" }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {PROJECTS.map((project) => (
            <Tile
              key={project.id}
              project={project}
              onClick={() => setModalId(project.id)}
            />
          ))}
        </motion.div>
      </div>

      <Modal isOpen={modalId !== null} onClose={() => setModalId(null)}>
        {modalId !== null && <ProjectModalContent id={modalId} />}
      </Modal>
    </section>
  );
}

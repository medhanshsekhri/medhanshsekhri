"use client";

import { motion } from "framer-motion";

const TACKS_LIGHT = ["#FF6F91", "#6FD3FF", "#FFE66D", "#6FFFB0"];
const TACKS_DARK = ["#D4AF37", "#F5E6C8"];

const POLAROIDS = [
  { image: "/frontview.jpg",    label: "In the Field",     rotate: -8,  top: 20, left: 5  },
  { image: "/topview.jpg",      label: "Building",         rotate: 5,   top: 10, left: 28 },
  { image: "/dragster.jpg",     label: "At Work",          rotate: -3,  top: 25, left: 52 },
  { image: "/rocket.jpg",       label: "Engineering",      rotate: 9,   top: 5,  left: 72 },
  { image: "/tower_side.jpg",   label: "Problem Solving",  rotate: -11, top: 48, left: 10 },
  { image: "/rover_front.jpg",  label: "Creating",         rotate: 4,   top: 45, left: 35 },
  { image: "/sideview.jpg",     label: "Collaborating",    rotate: -6,  top: 50, left: 60 },
  { image: "/circuit_image.png",label: "Innovating",       rotate: 10,  top: 68, left: 20 },
  { image: "/frontview.jpg",    label: "Exploring",        rotate: -4,  top: 72, left: 48 },
  { image: "/topview.jpg",      label: "Leading",          rotate: 7,   top: 65, left: 75 },
];

function Tack({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: -10,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, white 0%, ${color} 40%, color-mix(in srgb, ${color} 60%, black) 100%)`,
        boxShadow: `0 2px 4px rgba(0,0,0,0.35), 0 0 0 1.5px color-mix(in srgb, ${color} 70%, black)`,
      }}
    />
  );
}

export default function PolaroidWall() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 60% 40%, rgba(120,80,40,0.08) 0%, transparent 70%), " +
          "radial-gradient(ellipse at 20% 80%, rgba(100,60,20,0.06) 0%, transparent 60%)",
      }}
    >
      {POLAROIDS.map((p, i) => {
        const tackLight = TACKS_LIGHT[i % TACKS_LIGHT.length];
        const tackDark = TACKS_DARK[i % TACKS_DARK.length];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -40, rotate: p.rotate - 4 }}
            animate={{ opacity: 1, y: 0, rotate: p.rotate }}
            transition={{
              delay: i * 0.07,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ rotate: 0, scale: 1.08, zIndex: 20 }}
            whileTap={{ scale: 0.96, rotate: p.rotate * 0.5 }}
            style={{
              position: "absolute",
              top: `${p.top}%`,
              left: `${p.left}%`,
              zIndex: 10,
              cursor: "pointer",
            }}
          >
            {/* thumbtack — light mode */}
            <div className="dark:hidden">
              <Tack color={tackLight} />
            </div>
            {/* thumbtack — dark mode */}
            <div className="hidden dark:block">
              <Tack color={tackDark} />
            </div>

            {/* polaroid frame */}
            <div
              style={{
                width: "var(--pol-w, 140px)",
                background: "#FAFAFA",
                padding: "10px 10px 28px",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)",
                borderRadius: 2,
              }}
            >
              {/* image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  background: "#DDD",
                }}
              >
                <img
                  src={p.image}
                  alt={p.label}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    userSelect: "none",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.background = "#CCC";
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </div>

              {/* label */}
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 13,
                  color: "#333",
                  textAlign: "center",
                  margin: "6px 0 0",
                  lineHeight: 1,
                }}
              >
                {p.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

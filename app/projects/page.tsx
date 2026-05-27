"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sun, Moon } from "lucide-react";

type Media =
  | { type: "img"; src: string; alt: string; w: number; h: number }
  | { type: "video"; src: string; alt: string };

// Every image in /public, mixed across projects and personal shots.
const MEDIA: Media[] = [
  { type: "img", src: "/frontview.jpg", alt: "Radar scanner front", w: 1050, h: 1032 },
  { type: "video", src: "/video1.mp4", alt: "Radar scanner in action" },
  { type: "img", src: "/Soldering.jpg", alt: "Soldering electronics", w: 1330, h: 2364 },
  { type: "img", src: "/circuit_image.png", alt: "Radar circuit diagram", w: 2528, h: 2495 },
  { type: "img", src: "/topview.jpg", alt: "Radar scanner top", w: 787, h: 1002 },
  { type: "img", src: "/dragster.jpg", alt: "CO2 dragster", w: 3456, h: 4608 },
  { type: "video", src: "/dragster_video.mp4", alt: "CO2 dragster run" },
  { type: "img", src: "/cadets.jpg", alt: "Air Force Cadets bivouac", w: 4080, h: 3060 },
  { type: "img", src: "/sideview.jpg", alt: "Radar scanner side", w: 1081, h: 858 },
  { type: "img", src: "/rocket_upright.jpg", alt: "Model rocket", w: 3456, h: 4608 },
  { type: "video", src: "/rocket_video.mp4", alt: "Rocket launch" },
  { type: "img", src: "/topview2.jpg", alt: "Radar scanner detail", w: 990, h: 1205 },
  { type: "img", src: "/tower_top.jpg", alt: "Balsa truss tower top", w: 4000, h: 1844 },
  { type: "img", src: "/networking.jpg", alt: "International Science School gala", w: 5950, h: 3967 },
  { type: "img", src: "/tower_side.jpg", alt: "Balsa truss tower side", w: 4000, h: 1844 },
  { type: "img", src: "/rover_front.jpg", alt: "Warehouse rover front", w: 4080, h: 1884 },
  { type: "img", src: "/biology.jpg", alt: "Live fluke analysis, University of Sydney", w: 1180, h: 1572 },
  { type: "img", src: "/rover_side.jpg", alt: "Warehouse rover side", w: 4080, h: 1884 },
  { type: "img", src: "/nightlight.jpg", alt: "Custom night light build", w: 4000, h: 1844 },
  { type: "img", src: "/news.jpg", alt: "WIN News interview", w: 6720, h: 4480 },
  { type: "img", src: "/pose.jpg", alt: "Arduino project", w: 1206, h: 1608 },
  { type: "img", src: "/diamondda40.jpg", alt: "Flying a Diamond DA40 at RAAF Amberley", w: 4080, h: 3060 },
  { type: "img", src: "/UQ.jpg", alt: "University of Queensland", w: 1884, h: 2713 },
  { type: "img", src: "/news2.jpg", alt: "Together for Humanity Youth Summit", w: 1080, h: 720 },
];

// Tile background palette; CSS vars auto-swap between light and dark schemes.
const COLORS = [
  "var(--name-1)",
  "var(--name-2)",
  "var(--name-3)",
  "var(--name-4)",
  "var(--name-5)",
  "var(--name-6)",
];

function MediaTile({ media, color }: { media: Media; color: string }) {
  if (media.type === "video") {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-black">
        <video
          className="w-full h-auto block"
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  // Coloured box hugs the photo: a small uniform frame, no dead space.
  return (
    <div className="rounded-xl p-2 md:p-2.5" style={{ background: color }}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.w}
          height={media.h}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}

export default function ProjectsGallery() {
  const [isDark, setIsDark] = useState<boolean>(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [cols, setCols] = useState(4);
  const [count, setCount] = useState(MEDIA.length * 2);
  const sentinel = useRef<HTMLDivElement>(null);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Responsive column count, recomputed on resize.
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCols(w < 768 ? 2 : w < 1280 ? 3 : 4);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Endless scroll: append another full pass of the media whenever the
  // sentinel nears the viewport.
  const loadMore = useCallback(() => setCount((c) => c + MEDIA.length), []);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "1200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  // Round-robin into fixed columns so appended items never reflow earlier ones.
  const columns: { media: Media; g: number }[][] = Array.from({ length: cols }, () => []);
  for (let g = 0; g < count; g++) {
    columns[g % cols].push({ media: MEDIA[g % MEDIA.length], g });
  }

  return (
    <div className="relative z-10 min-h-screen">
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 md:px-8 h-16 border-b"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          borderColor: "var(--glass-border)",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-semibold text-text hover:opacity-75 transition-opacity"
          style={{ fontSize: "17px" }}
        >
          <ArrowLeft size={16} /> Medhansh Sekhri
        </Link>
        <button
          onClick={toggleDark}
          suppressHydrationWarning
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      <div className="flex gap-2.5 p-2.5 items-start">
        {columns.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-2.5">
            {col.map(({ media, g }) => (
              <div key={g} className="group">
                <MediaTile media={media} color={COLORS[g % COLORS.length]} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={sentinel} className="h-px w-full" aria-hidden />
    </div>
  );
}

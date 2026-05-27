"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const PARAGRAPHS = [
  <>A lot of people say they&apos;re passionate about aerospace. <strong className="text-text font-semibold">I build things.</strong> Before second year. Before anyone told me to.</>,
  <>I didn&apos;t wait for a class to teach me C++. I taught myself and built a functioning radar scanner.</>,
  <>I&apos;m <strong className="text-text font-semibold">hungry</strong> in a way that doesn&apos;t switch off. My parents gave up everything to put me here and I treat every day like that means something.</>,
  <>There is an itch that never goes away. A curiosity that does not ask for permission. I do not wait to be assigned a problem. I find one, pick it apart, and build something from what is left. That drive is not something I learned. It is just the way I am wired.</>,
];

const PHOTOS = [
  { src: "/diamondda40.jpg", alt: "Flying a Diamond DA40 at RAAF Amberley" },
  { src: "/networking.jpg",  alt: "International Science School 2025 gala" },
  { src: "/news.jpg",        alt: "WIN News interview" },
  { src: "/UQ.jpg",          alt: "University of Queensland" },
  { src: "/cadets.jpg",      alt: "Airforce Cadets Bivouac" },
  { src: "/pose.jpg",        alt: "Arduino project" },
  { src: "/news2.jpg",       alt: "Together for Humanity Youth Summit" },
  { src: "/biology.jpg",     alt: "Live fluke analysis, University of Sydney" },
  { src: "/nightlight.jpg",  alt: "Custom night light build" },
];

function PhotoTile({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-md border border-border bg-elevated">
      {/* Shimmer sits behind; the loaded photo paints over it. */}
      <div className="absolute inset-0 shimmer" aria-hidden />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 30vw, 170px"
        priority={eager}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-end p-2">
        <p className="text-white text-[10px] leading-tight font-body opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {alt}
        </p>
      </div>
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function WhyMe() {
  return (
    <section id="about" className="py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <div>
          <p className="text-muted text-xs uppercase tracking-[0.22em] font-body mb-3">About</p>
          <h2
            className="font-display font-semibold text-text mb-12"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Why Me<span className="text-accent">?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            {PARAGRAPHS.map((para, i) => (
              <p key={i} className="font-body text-base md:text-lg leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>

          {/* Photo grid: tidy 3x3 of uniform tiles, contained to one screen */}
          <FadeUp delay={0.15}>
            <div className="grid grid-cols-3 gap-2.5">
              {PHOTOS.map((photo, i) => (
                <PhotoTile key={photo.src} src={photo.src} alt={photo.alt} eager={i < 3} />
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

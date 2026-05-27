"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PARAGRAPHS = [
  <>A lot of people say they&apos;re passionate about aerospace. <strong className="text-text font-semibold">I build things.</strong> Before second year. Before anyone told me to.</>,
  <>I didn&apos;t wait for a class to teach me C++. I taught myself and built a functioning radar scanner.</>,
  <>I&apos;m <strong className="text-text font-semibold">hungry</strong> in a way that doesn&apos;t switch off. My parents gave up everything to put me here and I treat every day like that means something.</>,
  <>There is an itch that never goes away. A curiosity that does not ask for permission. I do not wait to be assigned a problem — I find one, pick it apart, and build something from what is left. That drive is not something I learned. It is just the way I am wired.</>,
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
        <FadeUp>
          <p className="text-muted text-xs uppercase tracking-[0.22em] font-body mb-3">About</p>
          <h2
            className="font-display font-semibold text-text mb-12"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Why Me<span className="text-accent">?</span>
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            {PARAGRAPHS.map((para, i) => (
              <FadeUp key={i} delay={0.08 * i}>
                <p className="font-body text-base md:text-lg leading-relaxed text-muted">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>

          {/* Photo grid — right column on desktop, below text on mobile */}
          <FadeUp delay={0.15}>
            <div className="columns-2 gap-3">
              {PHOTOS.map((photo, i) => (
                <div
                  key={photo.src}
                  className="mb-3 overflow-hidden rounded border border-border break-inside-avoid"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto block object-cover"
                    loading={i < 4 ? "eager" : "lazy"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).closest("div")!.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

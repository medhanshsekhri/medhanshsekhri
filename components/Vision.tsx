"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function Vision() {
  return (
    <section className="py-28 px-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <h2 className="font-display text-5xl md:text-6xl font-semibold text-text mb-16">
            The Vision.
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex gap-8 mb-12">
            {/* Gradient left border — light mode */}
            <div
              className="dark:hidden"
              style={{
                width: 3,
                flexShrink: 0,
                background: "linear-gradient(to bottom, #E04B52, #8C7AE6)",
                borderRadius: 2,
              }}
            />
            {/* Solid gold border — dark mode */}
            <div
              className="hidden dark:block"
              style={{
                width: 3,
                flexShrink: 0,
                background: "#C6A85B",
                borderRadius: 2,
              }}
            />
            <blockquote>
              <p
                className="font-display font-medium text-text italic leading-snug"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
              >
                &ldquo;I don&apos;t just want to think outside the box. I want to think
                outside the scopes of this planet.&rdquo;
              </p>
              <cite className="block mt-4 text-muted text-sm font-body not-italic">
                Medhansh Sekhri
              </cite>
            </blockquote>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-2xl">
            The{" "}
            <span className="text-[#E04B52] dark:text-[#C6A85B] font-medium">frontier</span>{" "}
            of aerospace and defence is where problems are hardest and stakes are highest.
            Autonomous systems, propulsion, structural design under extreme conditions. That is
            where I intend to be. Not when I am ready. Not when someone gives me permission.
            Already moving toward it &middot; one build at a time.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

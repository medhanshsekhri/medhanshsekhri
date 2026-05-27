"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

const CREDENTIALS = [
  {
    category: "Remote Pilot, UAV Operations",
    title: "Certificate III in Aviation",
    body: "Certified remote pilot for UAV operations under CASA guidelines. Trained in airspace regulations, flight planning, and safe operation of unmanned aircraft systems.",
  },
  {
    category: "In Progress",
    title: "More Coming",
    body: "Actively building toward additional certifications in embedded systems and aerospace. Watch this space.",
  },
];

export default function Certifications() {
  return (
    <section className="py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <h2
            className="font-display font-semibold text-text mb-12"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Credentials<span className="text-accent">.</span>
          </h2>
        </FadeUp>

        <div className="border-t border-border">
          {CREDENTIALS.map((item, i) => (
            <FadeUp key={item.title} delay={0.1 + i * 0.08}>
              <div className="py-8 border-b border-border grid md:grid-cols-[200px_1fr] gap-4 md:gap-10">
                <p className="text-muted text-xs uppercase tracking-wider font-body leading-relaxed">
                  {item.category}
                </p>
                <div>
                  <h3 className="font-display font-semibold text-text text-xl md:text-2xl mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted leading-relaxed max-w-xl">
                    {item.body}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

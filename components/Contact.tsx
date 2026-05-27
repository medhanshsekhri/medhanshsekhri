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

const LINKS = [
  {
    label: "Send an Email",
    href: "mailto:sekhrimedhansh@gmail.com",
    primary: true,
  },
  {
    label: "GitHub ↗",
    href: "https://github.com/medhanshsekhri",
    external: true,
  },
  {
    label: "LinkedIn ↗",
    href: "https://www.linkedin.com/in/medhansh-sekhri-81a133222",
    external: true,
  },
  {
    label: "Resume ↗",
    href: "/Medhansh_Sekhri_Engineering_Resume.pdf",
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <h2
            className="font-display font-semibold text-text mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Get in Touch<span className="text-accent">.</span>
          </h2>
          <p className="font-body text-muted text-base leading-relaxed max-w-xl mb-12">
            Most engineers wait to be discovered. I don&apos;t. If you&apos;re looking for someone who
            builds before they&apos;re asked, learns before they&apos;re taught, and leads before
            they&apos;re told — let&apos;s talk.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={
                  link.primary
                    ? "px-6 py-2.5 bg-text text-bg text-sm font-body font-medium hover:opacity-75 transition-opacity rounded"
                    : "px-6 py-2.5 border border-border text-text text-sm font-body hover:border-text transition-colors rounded"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

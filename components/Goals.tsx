"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const CARDS = [
  {
    icon: "🔥",
    title: "Hunger to be Different",
    body: "Not to be good. To be 1 in a billion.",
    accentLight: "#E04B52",
    accentDark: "#C6A85B",
    iconBgLight: "rgba(224,75,82,0.1)",
    iconBgDark: "rgba(198,168,91,0.12)",
  },
  {
    icon: "🌏",
    title: "Give the World Back",
    body: "My parents gave up everything for me. That is the fuel.",
    accentLight: "#8FB7B8",
    accentDark: "#0F8A5F",
    iconBgLight: "rgba(143,183,184,0.1)",
    iconBgDark: "rgba(15,138,95,0.12)",
  },
  {
    icon: "🛸",
    title: "Leave a Mark",
    body: "Defence. Space. Autonomous systems. Best in field then raise the bar.",
    accentLight: "#5FE0B3",
    accentDark: "#3A6EA5",
    iconBgLight: "rgba(95,224,179,0.1)",
    iconBgDark: "rgba(58,110,165,0.12)",
  },
];

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

export default function Goals() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <p className="text-[#F2B632] dark:text-[#C6A85B] text-xs uppercase tracking-[0.22em] font-body mb-3">
            WHAT DRIVES ME
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-semibold text-text mb-16">
            The Mission.
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <FadeUp key={card.title} delay={0.1 + i * 0.1}>
              <div
                className="group p-8 rounded-2xl border border-border bg-surface/80 dark:bg-surface/60 hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{ borderLeft: `3px solid ${isDark ? card.accentDark : card.accentLight}` }}
              >
                <span
                  className="text-3xl flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{ background: isDark ? card.iconBgDark : card.iconBgLight }}
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
                <h3
                  className="font-body font-semibold text-lg mb-3"
                  style={{ color: isDark ? card.accentDark : card.accentLight }}
                >
                  {card.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">{card.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

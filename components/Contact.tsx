"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import FolderIcon from "@/components/ui/folder";

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

const BTN: React.CSSProperties = {
  height: 56,
  minWidth: 140,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 12,
  textDecoration: "none",
  cursor: "pointer",
  flexShrink: 0,
  padding: "0 20px",
};

export default function Contact() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      className="py-24 px-5 md:px-16"
      style={{ background: "transparent" }}
    >
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <h2
            className="font-display font-semibold text-text leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Get in Touch.
          </h2>
          <div className="font-body text-muted text-base mb-12 leading-relaxed max-w-2xl">
            <p>
              Most engineers wait to be discovered. I don&apos;t. If you&apos;re looking for someone who
              builds before they&apos;re asked, learns before they&apos;re taught, and leads before
              they&apos;re told,
            </p>
            <p
              className="mt-2 font-semibold"
              style={{ fontSize: "1.18em", color: isDark ? "#C6A85B" : "#E04B52" }}
            >
              Let&apos;s talk.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 items-center">

            {/* Email */}
            <motion.a
              href="mailto:sekhrimedhansh@gmail.com"
              className="font-body"
              style={{
                ...BTN,
                background: isDark ? "#C6A85B" : "#E04B52",
                color: "#ffffff",
              }}
              whileHover={{ scale: 1.04, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.97 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: 16, height: 16, flexShrink: 0 }}
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span style={{ color: "#ffffff" }}>Send an Email</span>
            </motion.a>

            {/* GitHub */}
            <motion.a
              href="https://github.com/medhanshsekhri"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body"
              style={{
                ...BTN,
                background: isDark ? "#21262D" : "#F6F8FA",
                color: isDark ? "#ffffff" : "#24292e",
                border: isDark ? "1px solid #30363D" : "1px solid #D0D7DE",
              }}
              whileHover={{ scale: 1.04, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src={isDark
                  ? "https://images.shadcnspace.com/assets/svgs/icon-github-white.svg"
                  : "https://images.shadcnspace.com/assets/svgs/icon-github.svg"}
                alt="github"
                style={{ width: 18, height: 18 }}
              />
              <span style={{ color: isDark ? "#ffffff" : "#24292e" }}>GitHub</span>
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/medhansh-sekhri-81a133222"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body"
              style={{
                ...BTN,
                background: "#0077B5",
                color: "#ffffff",
              }}
              whileHover={{ scale: 1.04, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src="https://images.shadcnspace.com/assets/svgs/icon-linkedin.svg"
                alt="linkedin"
                style={{ width: 18, height: 18, filter: "brightness(0) invert(1)" }}
              />
              <span style={{ color: "#ffffff" }}>LinkedIn</span>
            </motion.a>

            {/* Resume */}
            <motion.a
              href="/Medhansh_Sekhri_Engineering_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body"
              style={{
                ...BTN,
                background: isDark ? "#C6A85B" : "#F2B632",
                color: "#ffffff",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div style={{ width: 32, height: 32, position: "relative", flexShrink: 0, overflow: "visible" }}>
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) scale(0.3)",
                  transformOrigin: "center center",
                  pointerEvents: "none",
                }}>
                  <FolderIcon />
                </div>
              </div>
              <span style={{ color: "#ffffff" }}>Resume</span>
            </motion.a>

          </div>
        </FadeUp>
      </div>
    </section>
  );
}

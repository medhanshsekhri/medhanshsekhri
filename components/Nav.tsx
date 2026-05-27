"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import GlassNav from "@/components/ui/glass-nav";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-shadow duration-300"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          borderColor: "var(--glass-border)",
          boxShadow: scrolled ? "0 8px 30px var(--glass-shadow)" : "none",
        }}
      >
        <nav className="max-w-6xl mx-auto px-5 md:px-6 h-16 flex items-center">
          <a
            href="#hero"
            className="font-display font-semibold text-text hover:opacity-75 transition-opacity"
            style={{ fontSize: "19px", letterSpacing: "-0.01em" }}
          >
            Medhansh Sekhri
          </a>

          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <GlassNav isDark={isDark} />

            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  >
                    <Sun size={14} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  >
                    <Moon size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span key="x" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                    <X size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center"
            style={{ background: isDark ? "rgba(13,13,13,0.97)" : "rgba(255,247,251,0.97)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display font-semibold text-text"
                  style={{ fontSize: "clamp(2.4rem, 10vw, 4rem)" }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ x: 8, color: isDark ? "#C6A85B" : "#E04B52" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

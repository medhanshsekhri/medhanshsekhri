"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import PhotoStack from "@/components/PhotoStack";

const PARAGRAPHS: ReactNode[] = [
  <>
    A lot of people say they&apos;re passionate about aerospace.{" "}
    <span className="text-[#E04B52] dark:text-[#C6A85B] font-semibold">I build things.</span>{" "}
    Before second year. Before anyone told me to.
  </>,
  <>
    I didn&apos;t wait for a class to teach me C++. I{" "}
    <span className="text-[#8FB7B8] dark:text-[#D1D1D6] font-semibold">taught myself</span>{" "}
    and built a functioning radar scanner.
  </>,
  <>
    I&apos;m{" "}
    <span className="text-[#E04B52] dark:text-[#C6A85B] font-semibold">hungry</span>{" "}
    in a way that doesn&apos;t switch off. My parents gave up everything to put me here and I
    treat every day like that means something.
  </>,
  <>
    There is an{" "}
    <span className="text-[#8FB7B8] dark:text-[#5FE0B3] font-semibold">itch that never goes away.</span>{" "}
    A{" "}
    <span className="text-[#8C7AE6] dark:text-[#C6A85B] font-semibold">curiosity that does not ask for permission.</span>{" "}
    I do not wait to be assigned a problem &middot; I find one, pick it apart, and build something
    from what is left. That drive is not something I learned. It is just the way I am wired.
  </>,
];

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
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

export default function WhyMe() {
  return (
    <section
      id="about"
      className="relative bg-transparent overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col md:flex-row" style={{ minHeight: "100vh" }}>

        {/* Left — text */}
        <div
          className="flex flex-col justify-center w-full md:w-[45%] px-8 md:px-16 py-20 md:py-0"
          style={{ paddingRight: "clamp(32px, 5vw, 64px)" }}
        >
          <FadeUp>
            <p className="text-[#8C7AE6] dark:text-[#C6A85B] text-xs uppercase tracking-[0.22em] font-body mb-3">
              ABOUT
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-text mb-12">
              Why{" "}
              <span className="text-[#E04B52] dark:text-[#C6A85B]">Me?</span>
            </h2>
          </FadeUp>
          <div className="space-y-7">
            {PARAGRAPHS.map((para, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.1}>
                <p className="font-body text-base md:text-lg leading-relaxed text-muted">
                  {para}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Right — photo stack */}
        <div
          className="w-full md:w-[55%] relative"
          style={{ height: "100vh", minHeight: 600 }}
        >
          {/* Mobile */}
          <div
            className="block md:hidden"
            style={{ height: 500, ["--photo-w" as string]: "120px" }}
          >
            <PhotoStack />
          </div>
          {/* Desktop */}
          <div className="hidden md:block" style={{ height: "100vh" }}>
            <PhotoStack />
          </div>
        </div>

      </div>
    </section>
  );
}

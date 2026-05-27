"use client";

import React from "react";

interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  external?: boolean;
}

// Frosted "liquid glass" surface. Tint adapts to theme via the --glass-bg var
// so content stays readable in both light and dark mode.
export function GlassEffect({
  children,
  className = "",
  style = {},
  href,
  external,
}: GlassEffectProps) {
  const glassStyle: React.CSSProperties = {
    boxShadow: "0 6px 6px rgba(0,0,0,0.18), 0 0 18px rgba(0,0,0,0.08)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex items-center justify-center font-medium overflow-hidden text-text transition-all duration-500 ${className}`}
      style={glassStyle}
    >
      <div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{ backdropFilter: "blur(3px)", filter: "url(#glass-distortion)", isolation: "isolate" }}
      />
      <div className="absolute inset-0 z-10 rounded-[inherit]" style={{ background: "var(--glass-bg)" }} />
      <div
        className="absolute inset-0 z-20 rounded-[inherit]"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.4)",
        }}
      />
      <div className="relative z-30 flex items-center justify-center">{children}</div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }
  return content;
}

// Render once per page; the filter is referenced by id from every GlassEffect.
export function GlassFilter() {
  return (
    <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="120" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

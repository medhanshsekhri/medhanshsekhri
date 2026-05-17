"use client";

import { useState } from "react";
import LeverSwitch from "./ui/lever-switch";

interface LaunchButtonProps {
  isActive: boolean;
  onActivate: (active: boolean) => void;
}

export default function LaunchButton({ isActive, onActivate }: LaunchButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: hovered ? 1 : 0.7,
        transition: "opacity 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <span
          style={{
            fontSize: 9,
            color: "#E04B52",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.8,
            fontFamily: "'Space Mono', monospace",
            whiteSpace: "nowrap",
          }}
        >
          You sure about this?
        </span>
      )}
      <span
        style={{
          fontSize: 9,
          color: "#E04B52",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: 0.6,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        DO NOT TOUCH
      </span>
      <LeverSwitch checked={isActive} onChange={onActivate} />
    </div>
  );
}

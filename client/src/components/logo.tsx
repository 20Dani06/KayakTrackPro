import React from "react";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kayax Logo"
    >
      <defs>
        <linearGradient id="kayaxGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#1769D7" />
          <stop offset="25%" stop-color="#3A86E8" />
          <stop offset="50%" stop-color="#6E7F97" />
          <stop offset="75%" stop-color="#7A6F66" />
          <stop offset="100%" stop-color="#A86A38" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Montserrat Alternates', sans-serif"
        fontWeight="200"
        fontSize="56"
        letterSpacing="4"
        fill="url(#kayaxGradient)"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
      >
        <tspan style={{ transform: "skewX(-10deg)", display: "inline-block" }}>
          K
        </tspan>
        AYAX
      </text>
    </svg>
  );
}

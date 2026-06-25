import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Maze-like border */}
    <path
      d="M20 20 H80 V80 H40 V60 H60 V40 H40 V80 H20 V20"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
    />
    {/* Escape Arrow */}
    <path
      d="M50 50 L85 15 M85 15 H65 M85 15 V35"
      stroke="#A855F7"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
    />
    {/* Inner glow point */}
    <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-pulse" />
  </svg>
);

export default Logo;

import React from "react";

export interface TechItem {
  name: string;
  icon: React.ReactNode;
}

export const TECH_ROW_1: TechItem[] = [
  {
    name: "Flutter",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="Flutter">
        <path fill="#42A5F5" d="M78.6 0L14.4 64.2l19.6 19.6L117.8 0H78.6z" />
        <path fill="#42A5F5" d="M78.6 49.1L39.3 88.4l19.6 19.6 39.3-39.3h19.6L78.6 49.1z" />
        <path fill="#01579B" d="M78.6 88.4l19.6 19.6H59l-19.7-19.6 19.7-19.6 19.6 19.6z" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="Next.js">
        <circle cx="64" cy="64" r="64" fill="#000000" />
        <path
          d="M87.5 96.2L49.1 46.8H40v34.4h6.7V56.5l34.7 44.8c2.1-1.6 4.1-3.3 6-5.1z"
          fill="url(#next-gradient)"
        />
        <defs>
          <linearGradient id="next-gradient" x1="56" y1="46" x2="84" y2="92" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="80.6" y="46.8" width="6.7" height="34.4" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "CodeIgniter",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="CodeIgniter">
        <path
          d="M60.8 7.3c2.7 6.3 2.1 13.9-.8 19.8-3.9 7.9-10.7 13.9-15.6 21.6-9.1 14.3-9.5 32.8-1 47.3 12.3 20.9 39.5 28.5 60.5 16.9 21-11.6 29.6-37.4 19.3-58.8-3.1-6.4-7.9-11.8-13.6-16-1.9 6.8-5.6 13.1-10.8 17.8-2 1.8-4.4 3.3-7 4.1 1.7-4.2 2.4-8.8 2-13.3-.6-6.8-3.8-13.2-8.6-18-5.4-5.4-12.4-9.1-19.4-12.7-2.1-1.1-4-2.3-5-8.7z"
          fill="#EE4326"
        />
        <path
          d="M50.4 46.8c-3.1 5.9-4.8 12.6-4.9 19.3 0 12.7 6.7 24.6 17.6 31.3 10.9 6.7 24.6 6.8 35.6.3 3.6-2.1 6.8-4.9 9.3-8.2-1.9 1.4-3.9 2.6-6.1 3.5-10.4 4.3-22.5 2.1-30.8-5.4-8.3-7.5-11.4-19.3-7.8-29.8 1.4-4.2 3.8-8 6.9-11.1-2.9-2.9-6-5.8-9.8-7.9 3.3 2.6 6.2 5.5 8.7 8.8-3.2-.2-6.5-.4-9.5-.8z"
          fill="#F39C12"
        />
      </svg>
    ),
  },
  {
    name: "React",
    icon: (
      <svg viewBox="-11.5 -10.232 23 20.463" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="React">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Dart",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="Dart">
        <path fill="#01579B" d="M26.4 10.5L10.5 26.4l43.2 43.2 33.6-17.6z" />
        <path fill="#00B0FF" d="M10.5 26.4v75.2l26.4 15.9 50.4-50.4z" />
        <path fill="#0081CB" d="M87.3 67.1l-50.4 50.4h64.7L117.5 102z" />
        <path fill="#40C4FF" d="M26.4 10.5h64.7l26.4 15.9-43.2 43.2z" />
        <path fill="#0091EA" d="M117.5 26.4v75.6l-15.9 15.5L67.1 82.8z" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" fill="#38BDF8" aria-label="Tailwind CSS">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "PHP",
    icon: (
      <svg viewBox="0 0 128 76" className="w-12 h-8 sm:w-13 sm:h-9 shrink-0 drop-shadow-xs" aria-label="PHP">
        <ellipse cx="64" cy="38" rx="60" ry="34" fill="#8892BF" stroke="#232531" strokeWidth="2.5" />
        <ellipse cx="64" cy="38" rx="55" ry="29" fill="#4F5B93" />
        <text x="64" y="48" fill="#FFFFFF" fontSize="30" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" fontStyle="italic">php</text>
      </svg>
    ),
  },
];

export const TECH_ROW_2: TechItem[] = [
  {
    name: "Figma",
    icon: (
      <svg viewBox="0 0 38 57" className="w-7 h-10 sm:w-8 sm:h-11 shrink-0 drop-shadow-xs" fill="none" aria-label="Figma">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
      </svg>
    ),
  },
  {
    name: "Photoshop",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl overflow-hidden drop-shadow-xs" aria-label="Adobe Photoshop">
        <rect width="128" height="128" rx="26" fill="#001E36" />
        <text x="40" y="86" fill="#31A8FF" fontSize="52" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P</text>
        <text x="86" y="86" fill="#31A8FF" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">s</text>
      </svg>
    ),
  },
  {
    name: "Premiere Pro",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl overflow-hidden drop-shadow-xs" aria-label="Adobe Premiere Pro">
        <rect width="128" height="128" rx="26" fill="#00005B" />
        <text x="40" y="86" fill="#9999FF" fontSize="52" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P</text>
        <text x="86" y="86" fill="#9999FF" fontSize="48" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">r</text>
      </svg>
    ),
  },
  {
    name: "Blender",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="Blender">
        <path fill="#EA7600" d="M85.7 60.3c15.2-1.9 27.2 9.5 27.2 24.7 0 14.1-11.5 25.6-25.6 25.6-13.6 0-24.7-10.7-25.5-24.1L8.7 58.7c-2.4-1.9-2.8-5.4-.9-7.8l5-6.3c1.9-2.4 5.4-2.8 7.8-.9l35.8 28.5L85.7 60.3z" />
        <circle cx="87.3" cy="85" r="14.5" fill="#225796" />
        <circle cx="87.3" cy="85" r="7.5" fill="#FFFFFF" />
        <path fill="#EA7600" d="M79.2 46.5c-2.8-1.2-4.1-4.4-2.9-7.2l8.8-20.5c1.2-2.8 4.4-4.1 7.2-2.9l7.4 3.2c2.8 1.2 4.1 4.4 2.9 7.2l-8.8 20.5c-1.2 2.8-4.4 4.1-7.2 2.9l-7.4-3.2zM45.5 48.7c1.2-2.8 4.4-4.1 7.2-2.9l20.5 8.8c2.8 1.2 4.1 4.4 2.9 7.2l-3.2 7.4c-1.2 2.8-4.4 4.1-7.2 2.9l-20.5-8.8c-2.8-1.2-4.1-4.4-2.9-7.2l3.2-7.4z" />
      </svg>
    ),
  },
  {
    name: "Android Studio",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-xs" aria-label="Android Studio">
        <circle cx="64" cy="64" r="56" fill="#F4F4F6" stroke="#D1D5DB" strokeWidth="2" />
        <path d="M44 86l20-56 20 56-8 4-12-32-12 32z" fill="#4285F4" />
        <circle cx="64" cy="38" r="7" fill="#4285F4" />
        <circle cx="78" cy="74" r="10" fill="#3DDC84" />
        <circle cx="75" cy="72" r="1.5" fill="#FFFFFF" />
        <circle cx="81" cy="72" r="1.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "Canva",
    icon: (
      <svg viewBox="0 0 128 128" className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl overflow-hidden drop-shadow-xs" aria-label="Canva">
        <defs>
          <linearGradient id="canva-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00C4CC" />
            <stop offset="100%" stopColor="#7D2AE8" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#canva-grad-2)" />
        <text x="64" y="78" fill="#FFFFFF" fontSize="38" fontStyle="italic" fontWeight="bold" textAnchor="middle" fontFamily="'Brush Script MT', cursive, sans-serif">Canva</text>
      </svg>
    ),
  },
];

// Combine both rows for other uses if needed
export const TECH_STACK = [...TECH_ROW_1, ...TECH_ROW_2];

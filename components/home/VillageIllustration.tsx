/** Rajasthan village scene: sun, dunes, huts, khejri tree and pond. Pure inline SVG, no text inside. */
export default function VillageIllustration({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 560 400"
      role="img"
      aria-label={label}
      className="h-auto w-full"
    >
      {/* sky */}
      <rect width="560" height="400" rx="24" fill="#EAF4EE" />
      <circle cx="430" cy="92" r="46" fill="#E8891C" opacity="0.9" />
      <circle cx="430" cy="92" r="64" fill="#E8891C" opacity="0.15" />
      {/* birds */}
      <path d="M150 70 q8 -8 16 0 q8 -8 16 0" stroke="#0B3D27" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M200 50 q6 -6 12 0 q6 -6 12 0" stroke="#0B3D27" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* far dunes */}
      <path d="M0 220 Q90 170 190 205 T380 195 T560 200 V400 H0Z" fill="#F3D9A8" />
      {/* near dunes */}
      <path d="M0 265 Q120 225 250 258 T560 245 V400 H0Z" fill="#E9C285" />
      <path d="M0 320 Q160 290 300 315 T560 305 V400 H0Z" fill="#DDB06E" />

      {/* khejri tree */}
      <g>
        <path d="M110 300 C112 260 106 235 98 215" stroke="#5B3A1E" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M104 238 C88 228 76 222 62 222" stroke="#5B3A1E" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M100 222 C112 208 126 202 142 200" stroke="#5B3A1E" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="96" cy="190" rx="58" ry="30" fill="#146C43" />
        <ellipse cx="62" cy="212" rx="30" ry="17" fill="#146C43" />
        <ellipse cx="140" cy="196" rx="32" ry="18" fill="#0B3D27" />
        <ellipse cx="100" cy="172" rx="34" ry="18" fill="#1E8553" />
      </g>

      {/* hut 1 */}
      <g>
        <rect x="200" y="238" width="78" height="56" rx="4" fill="#F7E6CC" stroke="#8A4B08" strokeWidth="2" />
        <path d="M188 242 L239 196 L290 242 Z" fill="#B7832F" stroke="#8A4B08" strokeWidth="2" strokeLinejoin="round" />
        <path d="M200 232 L239 204 M218 238 L247 210 M262 238 L239 214" stroke="#8A4B08" strokeWidth="1.5" opacity="0.6" />
        <rect x="229" y="260" width="20" height="34" rx="10" fill="#5B3A1E" />
        <path d="M202 282 H276" stroke="#E8891C" strokeWidth="3" strokeDasharray="6 5" />
      </g>

      {/* hut 2 (round) */}
      <g>
        <rect x="300" y="250" width="64" height="46" rx="4" fill="#FBEFD9" stroke="#8A4B08" strokeWidth="2" />
        <path d="M292 254 Q332 196 372 254 Z" fill="#C79440" stroke="#8A4B08" strokeWidth="2" strokeLinejoin="round" />
        <rect x="322" y="268" width="18" height="28" rx="9" fill="#5B3A1E" />
        <circle cx="332" cy="226" r="3" fill="#8A4B08" />
      </g>

      {/* pond */}
      <ellipse cx="440" cy="330" rx="92" ry="26" fill="#146C43" opacity="0.25" />
      <ellipse cx="440" cy="328" rx="84" ry="20" fill="#7FB8D6" />
      <path d="M392 326 q12 -5 24 0 M440 334 q12 -5 24 0 M468 322 q10 -4 20 0" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* small shrubs */}
      <circle cx="176" cy="300" r="10" fill="#1E8553" />
      <circle cx="188" cy="304" r="8" fill="#146C43" />
      <circle cx="384" cy="292" r="9" fill="#1E8553" />
      <circle cx="530" cy="300" r="11" fill="#146C43" />

      {/* path */}
      <path d="M239 296 C230 330 200 360 170 400 H250 C260 360 262 330 239 296Z" fill="#F3D9A8" opacity="0.8" />
    </svg>
  );
}

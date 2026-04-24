import { colors } from "@/theme";

/**
 * Hand-built SVG of the developer-desk illustration that opens the reel.
 * Purple monitors with light leak, blue desk, gaming chair, accent PC tower.
 */
export const DesktopIllustration: React.FC<{ size?: number }> = ({ size = 720 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.35))" }}
    >
      <defs>
        <linearGradient id="screen-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.illustration.monitorGlow} />
          <stop offset="100%" stopColor={colors.illustration.monitor} />
        </linearGradient>
        <linearGradient id="pc-glow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.illustration.pcGlow} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.illustration.pcGlow} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Wall shelf */}
      <rect x="120" y="160" width="360" height="14" rx="2" fill={colors.illustration.desk} />

      {/* Wall art frames with shapes */}
      <g>
        <rect x="140" y="100" width="56" height="56" rx="6" fill={colors.illustration.chair} />
        <polygon points="168,114 174,128 188,128 176,138 180,152 168,144 156,152 160,138 148,128 162,128" fill="#FFC93D" />

        <rect x="208" y="100" width="56" height="56" rx="6" fill={colors.illustration.chair} />
        <circle cx="236" cy="128" r="14" fill={colors.illustration.accent} />

        <rect x="276" y="100" width="56" height="56" rx="6" fill={colors.illustration.chair} />
        <polygon points="304,114 318,124 313,140 295,140 290,124" fill="#5B7CFF" />

        <rect x="344" y="100" width="56" height="56" rx="6" fill={colors.illustration.chair} />
        <polygon points="372,114 386,128 372,142 358,128" fill={colors.illustration.monitor} />
      </g>

      {/* Speaker/box on shelf */}
      <rect x="420" y="120" width="44" height="54" rx="4" fill={colors.illustration.chair} />
      {/* Lamp */}
      <g>
        <path d="M 360 174 Q 376 195 390 200" fill="none" stroke={colors.illustration.accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M 384 198 L 396 188 L 408 198 L 396 210 Z" fill={colors.illustration.accent} />
      </g>

      {/* Desk surface */}
      <rect x="80" y="380" width="440" height="20" rx="4" fill={colors.illustration.desk} />
      <rect x="100" y="400" width="6" height="120" fill={colors.illustration.desk} />
      <rect x="494" y="400" width="6" height="120" fill={colors.illustration.desk} />

      {/* Main monitor */}
      <g>
        <rect x="130" y="200" width="200" height="160" rx="6" fill={colors.illustration.chair} />
        <rect x="138" y="208" width="184" height="144" rx="3" fill="url(#screen-glow)" />
        {/* Light leak triangle */}
        <polygon points="138,208 240,208 200,310 138,352" fill="#FFFFFF" opacity="0.55" />
        {/* Stand */}
        <rect x="216" y="360" width="28" height="20" fill={colors.illustration.chair} />
        <rect x="194" y="376" width="72" height="6" rx="2" fill={colors.illustration.chair} />
      </g>

      {/* Right monitor */}
      <g>
        <rect x="340" y="240" width="150" height="120" rx="6" fill={colors.illustration.chair} />
        <rect x="346" y="246" width="138" height="106" rx="3" fill="url(#screen-glow)" />
        <polygon points="346,246 420,246 390,330 346,346" fill="#FFFFFF" opacity="0.5" />
      </g>

      {/* PC tower */}
      <g>
        <rect x="240" y="402" width="80" height="120" rx="6" fill={colors.illustration.pcCase} />
        <rect x="252" y="416" width="56" height="92" rx="4" fill="#0A0A10" />
        <circle cx="266" cy="436" r="8" fill="url(#pc-glow)" />
        <circle cx="294" cy="436" r="8" fill="url(#pc-glow)" />
        <circle cx="266" cy="464" r="8" fill="url(#pc-glow)" />
        <circle cx="294" cy="464" r="8" fill="url(#pc-glow)" />
      </g>

      {/* Gaming chair */}
      <g>
        <rect x="100" y="320" width="80" height="180" rx="14" fill={colors.illustration.chair} />
        <rect x="116" y="340" width="48" height="140" rx="8" fill={colors.illustration.accent} />
        <rect x="126" y="490" width="28" height="40" fill={colors.illustration.chair} />
        <rect x="100" y="528" width="80" height="10" rx="3" fill={colors.illustration.chair} />
        <rect x="92" y="538" width="20" height="20" rx="4" fill={colors.illustration.chair} />
        <rect x="168" y="538" width="20" height="20" rx="4" fill={colors.illustration.chair} />
      </g>
    </svg>
  );
};

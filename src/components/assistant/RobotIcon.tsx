import { useId } from "react";

/**
 * Cute robot head for the AI assistant (pure SVG — sharp on every screen).
 *
 * tone   "light" = white robot (for the gradient buttons) · "brand" = gradient robot (for dark areas)
 * mood   "idle" (blinks) · "thinking" (eyes scan left-right) · "happy" (^ ^ eyes)
 * look       eyes glance around now and then
 * hoverHappy eyes turn happy while a parent with class "group" is hovered
 * animated   false = completely still (used for older chat messages)
 *
 * Colours follow the site theme (var(--a) / var(--b)), so the robot changes
 * colour together with the theme button.
 */
export default function RobotIcon({
  className = "h-6 w-6",
  tone = "light",
  mood = "idle",
  look = false,
  hoverHappy = false,
  animated = true,
}: {
  className?: string;
  tone?: "light" | "brand";
  mood?: "idle" | "thinking" | "happy";
  look?: boolean;
  hoverHappy?: boolean;
  animated?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const head = `rb-head-${uid}`;
  const light = tone === "light";

  const classes = [
    "rb",
    animated ? "rb-anim" : "",
    animated && look ? "rb-look" : "",
    animated && mood === "thinking" ? "rb-thinking" : "",
    mood === "happy" ? "rb-mood-happy" : "",
    hoverHappy ? "rb-hover-happy" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const eye = light ? { fill: "var(--a)" } : { fill: "#ffffff" };
  const glow = light ? { fill: "var(--a)" } : { fill: "var(--b)" };
  const happyStroke = light ? { stroke: "var(--a)" } : { stroke: "#ffffff" };

  return (
    <svg viewBox="0 0 64 64" className={classes} aria-hidden focusable="false">
      <defs>
        <linearGradient id={head} x1="12" y1="14" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          {light ? (
            <>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d8dcec" />
            </>
          ) : (
            <>
              <stop offset="0" style={{ stopColor: "var(--a)" }} />
              <stop offset="1" style={{ stopColor: "var(--b)" }} />
            </>
          )}
        </linearGradient>
      </defs>

      {/* antenna */}
      <path d="M32 15.5V9.5" stroke={light ? "#eef0f8" : "rgba(255,255,255,0.75)"} strokeWidth="3" strokeLinecap="round" />
      <circle className="rb-antenna" cx="32" cy="7" r="4.2" style={light ? { fill: "var(--b)" } : { fill: "#ffffff" }} />
      <circle cx="30.6" cy="5.6" r="1.25" fill="#ffffff" opacity="0.85" />

      {/* ears */}
      <rect x="3.5" y="27" width="7.5" height="14" rx="3.75" fill={light ? "#c4c9dd" : "rgba(255,255,255,0.35)"} />
      <rect x="53" y="27" width="7.5" height="14" rx="3.75" fill={light ? "#c4c9dd" : "rgba(255,255,255,0.35)"} />

      {/* head */}
      <rect x="9" y="14" width="46" height="40" rx="16" fill={`url(#${head})`} />

      {/* face screen */}
      <rect x="15" y="22" width="34" height="22" rx="11" fill="#12121c" />
      <path d="M20.5 26.8c2-2.2 4.8-3.3 8.5-3.3" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* eyes */}
      <g className="rb-eyes">
        <g className="rb-eye">
          <rect x="20.2" y="27.3" width="10.1" height="11.4" rx="5" style={glow} opacity="0.28" />
          <rect x="22" y="28.6" width="6.5" height="8.8" rx="3.25" style={eye} />
          <rect x="23.4" y="30" width="1.9" height="2.6" rx="0.95" fill="#ffffff" opacity="0.75" />
        </g>
        <g className="rb-eye">
          <rect x="33.7" y="27.3" width="10.1" height="11.4" rx="5" style={glow} opacity="0.28" />
          <rect x="35.5" y="28.6" width="6.5" height="8.8" rx="3.25" style={eye} />
          <rect x="36.9" y="30" width="1.9" height="2.6" rx="0.95" fill="#ffffff" opacity="0.75" />
        </g>
      </g>

      {/* happy ^ ^ eyes */}
      <g className="rb-happy" fill="none" strokeWidth="2.8" strokeLinecap="round" style={happyStroke}>
        <path d="M21.6 35.2c1.2-3.6 6.1-3.6 7.3 0" />
        <path d="M35.1 35.2c1.2-3.6 6.1-3.6 7.3 0" />
      </g>

      {/* smile */}
      <path
        d="M27.6 48.3c2.7 2 6.1 2 8.8 0"
        stroke={light ? "#12121c" : "#ffffff"}
        strokeOpacity={light ? 0.3 : 0.55}
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

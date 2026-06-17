/**
 * Chic editorial wordmark for "Girls Gotta Golf".
 * - "i" in Girls uses a dotless ı with a golf ball overlaid as its dot.
 * - "G" in Gotta has a golf club leaning out from the inside of the circular bowl.
 * - "f" in Golf becomes a flag pole / flag while remaining legible as "f".
 *
 * The wordmark inherits color from its parent via currentColor and scales with font-size.
 */
export default function GirlsGottaGolfWordmark({
  className,
  ariaLabel = "Girls Gotta Golf",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span className={`ggg-wordmark ${className ?? ""}`} aria-label={ariaLabel} role="img">
      <span className="ggg-word">
        <span className="ggg-ltr">G</span>
        <span className="ggg-ltr ggg-i">
          {/* dotless i — Playfair renders ı without the tittle */}
          {"\u0131"}
          <svg
            className="ggg-ball"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="10" fill="#f9f2ea" stroke="currentColor" strokeWidth="1.25" />
            {/* dimples */}
            <circle cx="8.5" cy="10" r="1" fill="currentColor" opacity="0.55" />
            <circle cx="12" cy="8.5" r="1" fill="currentColor" opacity="0.55" />
            <circle cx="15.5" cy="10" r="1" fill="currentColor" opacity="0.55" />
            <circle cx="10" cy="13" r="1" fill="currentColor" opacity="0.55" />
            <circle cx="14" cy="13" r="1" fill="currentColor" opacity="0.55" />
            <circle cx="12" cy="15.5" r="1" fill="currentColor" opacity="0.55" />
          </svg>
        </span>
        <span className="ggg-ltr">r</span>
        <span className="ggg-ltr">l</span>
        <span className="ggg-ltr">s</span>
      </span>{" "}
      <span className="ggg-word">
        <span className="ggg-ltr ggg-g-club">
          G
          <svg
            className="ggg-club"
            viewBox="0 0 60 100"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* shaft leaning from inside the bowl up and to the right */}
            <line
              x1="18"
              y1="88"
              x2="50"
              y2="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* grip */}
            <line
              x1="48"
              y1="14"
              x2="54"
              y2="6"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* club head */}
            <path
              d="M14 92 Q10 96 14 99 L26 95 Q28 92 24 88 Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="ggg-ltr">o</span>
        <span className="ggg-ltr">t</span>
        <span className="ggg-ltr">t</span>
        <span className="ggg-ltr">a</span>
      </span>{" "}
      <span className="ggg-word">
        <span className="ggg-ltr">G</span>
        <span className="ggg-ltr">o</span>
        <span className="ggg-ltr">l</span>
        <span className="ggg-ltr ggg-f-flag">
          f
          <svg
            className="ggg-flag"
            viewBox="0 0 40 100"
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* flag waving off the top of the f's ascender */}
            <path
              d="M8 6 Q22 2 30 8 Q24 14 30 20 Q22 18 8 22 Z"
              fill="currentColor"
            />
            {/* tiny base tick like a hole marker */}
            <line
              x1="3"
              y1="96"
              x2="13"
              y2="96"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </span>
      </span>
    </span>
  );
}

/**
 * "Girls Gotta Golf" wordmark — original CSS-styled text version.
 * White, inherits h1 sizing from .beat h1. Two small accents:
 *  - dot on the "i" in Girls replaced with a golf ball
 *  - the final "f" in Golf carries a small flag at the top of its stem
 */
export default function GirlsGottaGolfWordmark({
  className,
  ariaLabel = "Girls Gotta Golf",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span
      className={`ggg-wordmark ${className ?? ""}`}
      role="img"
      aria-label={ariaLabel}
    >
      <span className="ggg-word">
        Gir
        <span className="ggg-i" aria-hidden="true">
          <span className="ggg-i-stem">ı</span>
          <span className="ggg-ball" />
        </span>
        ls
      </span>{" "}
      <span className="ggg-word">Gotta</span>{" "}
      <span className="ggg-word">
        Gol
        <span className="ggg-f" aria-hidden="true">
          f
          <span className="ggg-flag" />
        </span>
      </span>
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

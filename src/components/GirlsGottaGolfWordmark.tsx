import wordmarkAsset from "@/assets/ggg-wordmark.png.asset.json";

/**
 * "Girls Gotta Golf" wordmark — rendered from the uploaded logo PNG,
 * recolored via CSS mask to the current cream design token so it sits
 * naturally on the dark hero frames.
 */
export default function GirlsGottaGolfWordmark({
  className,
  ariaLabel = "Girls Gotta Golf",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const maskStyle = {
    WebkitMaskImage: `url(${wordmarkAsset.url})`,
    maskImage: `url(${wordmarkAsset.url})`,
  } as React.CSSProperties;

  return (
    <span
      className={`ggg-wordmark ${className ?? ""}`}
      role="img"
      aria-label={ariaLabel}
    >
      <span className="ggg-wordmark-mask" style={maskStyle} aria-hidden="true" />
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

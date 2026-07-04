import { Music2 } from "lucide-react";
import clsx from "clsx";

/**
 * Renders album art with a graceful gradient fallback (no broken-image
 * icons) when coverArt is missing. `spinning` adds the slow vinyl-style
 * rotation used for the currently-playing thumbnail in the player bar.
 */
export default function CoverArt({ src, alt = "", size = 48, rounded = "md", spinning = false, className }) {
  const radiusClass = { sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", full: "rounded-full" }[rounded];

  return (
    <div
      className={clsx(
        "relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-accent2/30 to-accent/20",
        radiusClass,
        spinning && "animate-spin-slow",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Music2 className="text-text-tertiary" size={Math.max(14, size * 0.35)} />
        </div>
      )}
      {spinning && (
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_6px_rgba(11,11,12,0.55)]" />
      )}
    </div>
  );
}

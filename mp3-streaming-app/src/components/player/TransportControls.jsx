import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1 } from "lucide-react";
import clsx from "clsx";
import { usePlayerStore } from "../../store/usePlayerStore";

export default function TransportControls({ size = "default" }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const queue = usePlayerStore((s) => s.queue);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  const disabled = queue.length === 0;
  const large = size === "large";
  const playBtnSize = large ? 60 : 34;
  const iconSize = large ? 20 : 15;
  const sideIconSize = large ? 22 : 17;

  return (
    <div className={clsx("flex items-center", large ? "gap-6" : "gap-5")}>
      <button
        onClick={toggleShuffle}
        disabled={disabled}
        aria-label="Toggle shuffle"
        aria-pressed={shuffle}
        className={clsx(
          "transition-colors disabled:opacity-30",
          shuffle ? "text-accent2" : "text-text-secondary hover:text-text-primary"
        )}
      >
        <Shuffle size={sideIconSize - 3} />
      </button>

      <button
        onClick={previous}
        disabled={disabled}
        aria-label="Previous track"
        className="text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
      >
        <SkipBack size={sideIconSize} fill="currentColor" />
      </button>

      <button
        onClick={togglePlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
        style={{ width: playBtnSize, height: playBtnSize }}
        className="flex items-center justify-center rounded-full bg-accent text-white shadow-glow
          transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
      >
        {isPlaying ? (
          <Pause size={iconSize} fill="currentColor" />
        ) : (
          <Play size={iconSize} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <button
        onClick={next}
        disabled={disabled}
        aria-label="Next track"
        className="text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
      >
        <SkipForward size={sideIconSize} fill="currentColor" />
      </button>

      <button
        onClick={cycleRepeat}
        disabled={disabled}
        aria-label="Toggle repeat mode"
        aria-pressed={repeatMode !== "off"}
        className={clsx(
          "transition-colors disabled:opacity-30",
          repeatMode !== "off" ? "text-accent2" : "text-text-secondary hover:text-text-primary"
        )}
      >
        {repeatMode === "one" ? <Repeat1 size={sideIconSize - 3} /> : <Repeat size={sideIconSize - 3} />}
      </button>
    </div>
  );
}

import { useState } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { formatTime } from "../../utils/formatTime";

export default function SeekBar({ compact = false }) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const queue = usePlayerStore((s) => s.queue);
  const [scrubValue, setScrubValue] = useState(null);

  const displayTime = scrubValue ?? currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-2.5">
      <span className="w-9 flex-shrink-0 text-right font-mono text-[11px] text-text-tertiary">
        {formatTime(displayTime)}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={displayTime}
        disabled={queue.length === 0}
        onChange={(e) => setScrubValue(Number(e.target.value))}
        onMouseUp={(e) => {
          seekTo(Number(e.target.value));
          setScrubValue(null);
        }}
        onTouchEnd={(e) => {
          seekTo(Number(e.target.value));
          setScrubValue(null);
        }}
        aria-label="Seek"
        className="seek-range h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border-subtle
          accent-accent disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #3B82F6 ${progress}%, rgba(255,255,255,0.08) ${progress}%)`,
        }}
      />
      {!compact && (
        <span className="w-9 flex-shrink-0 font-mono text-[11px] text-text-tertiary">{formatTime(duration)}</span>
      )}
    </div>
  );
}

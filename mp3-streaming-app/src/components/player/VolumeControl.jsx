import { Volume2, Volume1, VolumeX } from "lucide-react";
import { usePlayerStore } from "../../store/usePlayerStore";

export default function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  const effectiveVolume = muted ? 0 : volume;
  const Icon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="hidden items-center gap-2 md:flex" style={{ width: 120 }}>
      <button onClick={toggleMute} aria-label="Toggle mute" className="text-text-secondary hover:text-text-primary">
        <Icon size={17} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={effectiveVolume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full accent-accent"
        style={{
          background: `linear-gradient(to right, #9CA3AF ${effectiveVolume * 100}%, rgba(255,255,255,0.08) ${
            effectiveVolume * 100
          }%)`,
        }}
      />
    </div>
  );
}

import { Heart, ListMusic } from "lucide-react";
import clsx from "clsx";
import { useAudioEngine } from "../../hooks/useAudioEngine";
import { useFavorites } from "../../hooks/useFavorites";
import { usePlayerStore } from "../../store/usePlayerStore";
import CoverArt from "../common/CoverArt";
import TransportControls from "./TransportControls";
import SeekBar from "./SeekBar";
import VolumeControl from "./VolumeControl";

export default function PlayerBar({ onToggleQueue, queueOpen }) {
  const { audioRef, currentSong } = useAudioEngine();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface-glass backdrop-blur-glass"
      style={{ height: 88 }}
    >
      {/* The single audio element for the whole app. */}
      <audio ref={audioRef} preload="metadata" />

      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[1fr] items-center gap-4 px-4 md:grid-cols-[280px_1fr_280px] md:px-6">
        {/* Now playing */}
        <div className="hidden min-w-0 items-center gap-3.5 md:flex">
          <CoverArt src={currentSong?.coverArt} size={56} spinning={isPlaying && !!currentSong} />
          <div className="min-w-0">
            <p className="truncate font-display text-[14.5px] font-medium">
              {currentSong?.title || "Nothing playing"}
            </p>
            <p className="truncate text-xs text-text-secondary">{currentSong?.artist || "Pick a song to start"}</p>
          </div>
          {currentSong && (
            <button
              onClick={() => toggleFavorite(currentSong.id)}
              aria-label="Toggle favorite"
              className="ml-1 flex-shrink-0 text-text-tertiary hover:text-accent2"
            >
              <Heart size={16} fill={isFavorite(currentSong.id) ? "currentColor" : "none"} className={isFavorite(currentSong.id) ? "text-accent2" : ""} />
            </button>
          )}
        </div>

        {/* Transport + seek */}
        <div className="flex flex-col items-center gap-1.5 md:mx-auto md:w-full md:max-w-[560px]">
          <div className="flex w-full items-center justify-center gap-4 md:hidden">
            <CoverArt src={currentSong?.coverArt} size={38} spinning={isPlaying && !!currentSong} />
            <p className="truncate text-[13px] font-medium">{currentSong?.title || "Nothing playing"}</p>
          </div>
          <TransportControls />
          <div className="hidden w-full md:block">
            <SeekBar />
          </div>
        </div>

        {/* Volume + queue toggle */}
        <div className="hidden items-center justify-end gap-4 md:flex">
          <VolumeControl />
          <button
            onClick={onToggleQueue}
            aria-label="Toggle queue panel"
            aria-pressed={queueOpen}
            className={clsx(
              "rounded-md border border-border-subtle p-2 transition-colors",
              queueOpen ? "text-accent2 border-accent2/40 bg-accent2/10" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <ListMusic size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

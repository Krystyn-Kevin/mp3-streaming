import { Heart, Plus, ListPlus, Pause } from "lucide-react";
import clsx from "clsx";
import CoverArt from "../common/CoverArt";
import { formatTime } from "../../utils/formatTime";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useFavorites } from "../../hooks/useFavorites";

const GRID_COLS = "md:grid-cols-[40px_minmax(0,2.4fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_70px_84px]";

export default function SongRow({ song, index, songsInView, isCurrent }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const playNextInQueue = usePlayerStore((s) => s.playNextInQueue);
  const { isFavorite, toggleFavorite } = useFavorites();

  function handleRowClick() {
    if (isCurrent) {
      togglePlay();
    } else {
      playQueue(songsInView, index);
    }
  }

  return (
    <div
      className={clsx("table-row group flex cursor-pointer items-center gap-3 md:grid", GRID_COLS, isCurrent && "bg-surface")}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      title={song.uploadedByName ? `Added by ${song.uploadedByName}` : undefined}
      onKeyDown={(e) => e.key === "Enter" && handleRowClick()}
    >
      <div className="hidden items-center justify-center md:flex">
        {isCurrent && isPlaying ? (
          <div className="flex h-3.5 items-end gap-[2.5px]">
            <span className="w-[3px] animate-pulse-bar bg-accent" style={{ animationDelay: "0ms", height: "60%" }} />
            <span className="w-[3px] animate-pulse-bar bg-accent" style={{ animationDelay: "150ms", height: "100%" }} />
            <span className="w-[3px] animate-pulse-bar bg-accent" style={{ animationDelay: "300ms", height: "75%" }} />
          </div>
        ) : isCurrent ? (
          <Pause size={13} className="text-accent" />
        ) : (
          <span className="font-mono text-xs text-text-tertiary group-hover:hidden">{index + 1}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none">
        <CoverArt src={song.coverArt} size={40} rounded="sm" />
        <div className="min-w-0">
          <p className={clsx("truncate font-display text-[14px] font-medium", isCurrent && "text-accent")}>
            {song.title}
          </p>
          <p className="truncate text-[12px] text-text-tertiary md:hidden">{song.artist}</p>
        </div>
      </div>

      <p className="hidden truncate text-[13px] text-text-secondary md:block">{song.artist}</p>
      <p className="hidden truncate text-[13px] text-text-tertiary md:block">{song.composer || "—"}</p>
      <p className="hidden truncate text-[13px] text-text-tertiary md:block">{song.album}</p>
      <p className="hidden text-right font-mono text-[12px] text-text-tertiary md:block">{formatTime(song.duration)}</p>
      <p className="font-mono text-[11px] text-text-tertiary md:hidden">{formatTime(song.duration)}</p>

      <div className="hidden items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          aria-label="Toggle favorite"
          className="icon-btn"
        >
          <Heart size={14} fill={isFavorite(song.id) ? "currentColor" : "none"} className={isFavorite(song.id) ? "text-accent2" : ""} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playNextInQueue(song);
          }}
          aria-label="Play next"
          className="icon-btn"
          title="Play next"
        >
          <ListPlus size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(song);
          }}
          aria-label="Add to queue"
          className="icon-btn"
          title="Add to queue"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

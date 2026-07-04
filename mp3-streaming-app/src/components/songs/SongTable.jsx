import { usePlayerStore } from "../../store/usePlayerStore";
import SongRow from "./SongRow";

const GRID_COLS = "grid-cols-[40px_minmax(0,2.4fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_70px_84px]";

export default function SongTable({ songs, emptyMessage = "No songs found." }) {
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const queue = usePlayerStore((s) => s.queue);
  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  if (!songs.length) {
    return <p className="py-10 text-center text-sm text-text-tertiary">{emptyMessage}</p>;
  }

  return (
    <div>
      <div
        className={`hidden md:grid ${GRID_COLS} gap-3 border-b border-border-subtle px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary`}
      >
        <span className="text-center">#</span>
        <span>Song</span>
        <span>Artist</span>
        <span>Composer</span>
        <span>Album</span>
        <span className="text-right">Duration</span>
        <span></span>
      </div>
      <div className="mt-1 flex flex-col gap-0.5">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} songsInView={songs} isCurrent={currentSong?.id === song.id} />
        ))}
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Play, UploadCloud } from "lucide-react";
import { useSongs } from "../hooks/useSongs";
import { useHistory } from "../hooks/useHistory";
import { usePlayerStore } from "../store/usePlayerStore";
import { useIsAdmin } from "../hooks/useIsAdmin";
import CoverArt from "../components/common/CoverArt";
import Spinner from "../components/common/Spinner";

function groupByAlbum(songs) {
  const map = new Map();
  for (const song of songs) {
    const key = song.album || "Unknown Album";
    if (!map.has(key)) map.set(key, { name: key, artist: song.artist, coverArt: song.coverArt, songs: [] });
    map.get(key).songs.push(song);
  }
  return Array.from(map.values());
}

export default function HomePage() {
  useOutletContext(); // searchQuery not used on Home, but keeps context wired
  const { songs, loading } = useSongs();
  const { history } = useHistory();
  const playQueue = usePlayerStore((s) => s.playQueue);
  const isAdmin = useIsAdmin();

  const albums = useMemo(() => groupByAlbum(songs), [songs]);
  const recentSongs = useMemo(() => {
    const bySongId = new Map(songs.map((s) => [s.id, s]));
    return history.map((h) => bySongId.get(h.songId)).filter(Boolean).slice(0, 6);
  }, [history, songs]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="font-display text-lg font-medium text-text-secondary">Your shelf is empty</p>
        <p className="max-w-sm text-sm text-text-tertiary">
          {isAdmin
            ? "Be the first to add something — songs you upload show up for everyone right away."
            : "Nothing's been added to the library yet. Check back soon."}
        </p>
        {isAdmin && (
          <Link to="/upload" className="btn-primary mt-2">
            <UploadCloud size={15} />
            Upload a song
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {recentSongs.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold">Recently Played</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => playQueue(songs, songs.findIndex((s) => s.id === song.id))}
                className="group w-36 flex-shrink-0 text-left"
              >
                <div className="relative">
                  <CoverArt src={song.coverArt} size={144} rounded="md" className="w-full transition-transform duration-200 group-hover:-translate-y-1" />
                  <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-glow transition-opacity group-hover:opacity-100">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
                <p className="mt-2 truncate text-sm font-medium">{song.title}</p>
                <p className="truncate text-xs text-text-tertiary">{song.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">Your Library</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.map((album) => (
            <button
              key={album.name}
              onClick={() => playQueue(album.songs, 0)}
              className="group text-left"
            >
              <div className="relative">
                <CoverArt src={album.coverArt} size={200} rounded="md" className="aspect-square w-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-floating" />
                <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-glow transition-opacity group-hover:opacity-100">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
              <p className="mt-2 truncate font-display text-sm font-medium">{album.name}</p>
              <p className="truncate text-xs text-text-tertiary">{album.artist}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

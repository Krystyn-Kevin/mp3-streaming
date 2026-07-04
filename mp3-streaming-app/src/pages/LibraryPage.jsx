import { useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { useSongs } from "../hooks/useSongs";
import { useIsAdmin } from "../hooks/useIsAdmin";
import SongTable from "../components/songs/SongTable";
import Spinner from "../components/common/Spinner";

export default function LibraryPage() {
  const { searchQuery } = useOutletContext();
  const { songs, loading, error } = useSongs();
  const isAdmin = useIsAdmin();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((s) =>
      [s.title, s.artist, s.composer, s.album].filter(Boolean).some((field) => field.toLowerCase().includes(q))
    );
  }, [songs, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-danger">
        Couldn't load your library. Check your Firestore rules and connection.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-tertiary">{filtered.length} songs</p>
        {isAdmin && (
          <Link to="/upload" className="btn-ghost !py-2 !px-4 text-xs">
            <UploadCloud size={14} />
            Add a song
          </Link>
        )}
      </div>
      <SongTable songs={filtered} emptyMessage="No songs match your search." />
    </div>
  );
}

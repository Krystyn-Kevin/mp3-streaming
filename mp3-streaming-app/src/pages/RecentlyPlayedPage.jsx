import { useMemo } from "react";
import { useHistory } from "../hooks/useHistory";
import { useSongs } from "../hooks/useSongs";
import SongTable from "../components/songs/SongTable";
import Spinner from "../components/common/Spinner";

export default function RecentlyPlayedPage() {
  const { history } = useHistory();
  const { songs, loading: songsLoading } = useSongs();

  const recentSongs = useMemo(() => {
    const bySongId = new Map(songs.map((s) => [s.id, s]));
    const seen = new Set();
    const result = [];
    for (const entry of history) {
      const song = bySongId.get(entry.songId);
      if (song && !seen.has(song.id)) {
        seen.add(song.id);
        result.push(song);
      }
    }
    return result;
  }, [history, songs]);

  if (songsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <SongTable songs={recentSongs} emptyMessage="Nothing played yet — pick a song from your library to start." />;
}

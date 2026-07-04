import { useMemo } from "react";
import { useSongs } from "../hooks/useSongs";
import { useFavorites } from "../hooks/useFavorites";
import SongTable from "../components/songs/SongTable";
import Spinner from "../components/common/Spinner";

export default function FavoritesPage() {
  const { songs, loading } = useSongs();
  const { favoriteIds } = useFavorites();

  const favoriteSongs = useMemo(
    () => songs.filter((s) => favoriteIds.includes(s.id)),
    [songs, favoriteIds]
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <SongTable songs={favoriteSongs} emptyMessage="No favorites yet — tap the heart on any song to save it here." />
  );
}

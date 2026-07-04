import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToFavorites, addFavorite, removeFavorite } from "../firebase/firestore";

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    const unsubscribe = subscribeToFavorites(user.uid, setFavoriteIds);
    return unsubscribe;
  }, [user]);

  const isFavorite = useCallback((songId) => favoriteIds.includes(songId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (songId) => {
      if (!user) return;
      if (favoriteIds.includes(songId)) {
        await removeFavorite(user.uid, songId);
      } else {
        await addFavorite(user.uid, songId);
      }
    },
    [user, favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite };
}

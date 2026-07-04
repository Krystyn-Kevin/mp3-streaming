import { useEffect, useState } from "react";
import { subscribeToSongs } from "../firebase/firestore";

/**
 * Subscribes to the `songs` collection in Firestore in realtime.
 * Returns { songs, loading, error }.
 *
 * Songs come back exactly as stored — resolving audioUrl/coverArt to a
 * playable download URL (see firebase/storage.js) happens lazily, only for
 * the song that's actually about to play, to avoid firing a Storage call
 * for every row in a large library on load.
 */
export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToSongs(
      (data) => {
        setSongs(data);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load songs:", err);
        setError(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { songs, loading, error };
}

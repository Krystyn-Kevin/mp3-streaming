import { useState } from "react";
import { deleteSongDoc } from "../firebase/firestore";
import { deleteSongFiles } from "../firebase/storage";
import { usePlayerStore } from "../store/usePlayerStore";

export function useDeleteSong() {
  const [deletingId, setDeletingId] = useState(null);
  const removeSongEverywhere = usePlayerStore((s) => s.removeSongEverywhere);

  async function deleteSong(song) {
    setDeletingId(song.id);
    try {
      // Pull it out of the current queue first so playback doesn't try to
      // resolve a URL that's about to stop existing.
      removeSongEverywhere(song.id);
      await deleteSongDoc(song.id);
      await deleteSongFiles(song);
    } finally {
      setDeletingId(null);
    }
  }

  return { deleteSong, deletingId };
}

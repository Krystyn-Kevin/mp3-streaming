import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadFileWithProgress, buildStoragePath } from "../firebase/storage";
import { createSongDoc } from "../firebase/firestore";
import { getAudioDuration } from "../utils/getAudioDuration";

/**
 * Handles the full "add a song to the shared library" flow:
 *   1. read duration from the audio file client-side
 *   2. upload the audio file to Storage (audio/{uid}/...)
 *   3. optionally upload cover art (covers/{uid}/...)
 *   4. write the songs/{id} Firestore document
 *
 * Any signed-in user can do this — the library is shared and open, per
 * firebase/firestore.rules and firebase/storage.rules. The new song shows
 * up for every user immediately via the realtime `songs` subscription.
 */
export function useSongUpload() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | reading | audio | cover | saving | done | error
  const [error, setError] = useState(null);

  async function uploadSong({ title, artist, composer, album, audioFile, coverFile }) {
    if (!user) throw new Error("You must be signed in to upload.");
    if (!audioFile) throw new Error("Choose an audio file.");
    if (!title.trim() || !artist.trim()) throw new Error("Title and artist are required.");

    setError(null);
    setProgress(0);

    try {
      setStage("reading");
      const duration = await getAudioDuration(audioFile);

      setStage("audio");
      const audioPath = buildStoragePath("audio", user.uid, audioFile);
      const audioUrl = await uploadFileWithProgress(audioFile, audioPath, (pct) => setProgress(pct * 0.85));

      let coverArt = null;
      if (coverFile) {
        setStage("cover");
        const coverPath = buildStoragePath("covers", user.uid, coverFile);
        coverArt = await uploadFileWithProgress(coverFile, coverPath, (pct) => setProgress(85 + pct * 0.1));
      }

      setStage("saving");
      setProgress(97);
      const songId = await createSongDoc(
        {
          title: title.trim(),
          artist: artist.trim(),
          composer: composer.trim() || "",
          album: album.trim() || "Singles",
          coverArt,
          audioUrl,
          duration,
        },
        user
      );

      setProgress(100);
      setStage("done");
      return songId;
    } catch (err) {
      setStage("error");
      setError(err.message || "Upload failed. Please try again.");
      throw err;
    }
  }

  function reset() {
    setProgress(0);
    setStage("idle");
    setError(null);
  }

  return { uploadSong, progress, stage, error, reset, isUploading: !["idle", "done", "error"].includes(stage) };
}

import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { resolveAudioUrl } from "../firebase/storage";
import { useHistory } from "./useHistory";

/**
 * Owns the single <audio> element for the whole app. Mount this once (in
 * PlayerBar, which is always present) — every other component should only
 * ever talk to the audio element indirectly, through usePlayerStore.
 */
export function useAudioEngine() {
  const audioRef = useRef(null);
  const { recordPlay } = useHistory();

  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const queue = usePlayerStore((s) => s.queue);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const seekRequest = usePlayerStore((s) => s.currentTime);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const next = usePlayerStore((s) => s.next);
  const repeatMode = usePlayerStore((s) => s.repeatMode);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;
  const lastLoadedSongId = useRef(null);
  const isSeekingRef = useRef(false);

  // Load a new source whenever the current song changes.
  useEffect(() => {
    let cancelled = false;
    async function loadSource() {
      const audio = audioRef.current;
      if (!audio || !currentSong) return;

      if (lastLoadedSongId.current === currentSong.id) return;
      lastLoadedSongId.current = currentSong.id;

      try {
        const url = await resolveAudioUrl(currentSong.audioUrl);
        if (cancelled || !url) return;
        audio.src = url;
        audio.load();
        if (isPlaying) {
          await audio.play().catch(() => {});
        }
        recordPlay(currentSong);

        // Media Session API — surfaces title/art/controls on lock screens
        // and hardware media keys.
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new window.MediaMetadata({
            title: currentSong.title,
            artist: currentSong.artist,
            album: currentSong.album,
            artwork: currentSong.coverArt
              ? [{ src: currentSong.coverArt, sizes: "512x512", type: "image/jpeg" }]
              : [],
          });
        }
      } catch (err) {
        console.error("Failed to load audio source:", err);
      }
    }
    loadSource();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // Play / pause in response to store state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Volume / mute.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // External seek requests (from the store, e.g. clicking the seek bar)
  // are reflected onto the audio element without fighting the timeupdate
  // listener below.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Math.abs(audio.currentTime - seekRequest) > 0.75) {
      isSeekingRef.current = true;
      audio.currentTime = seekRequest;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekRequest]);

  // Wire native audio events back into the store.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      isSeekingRef.current = false;
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode]);

  return { audioRef, currentSong };
}

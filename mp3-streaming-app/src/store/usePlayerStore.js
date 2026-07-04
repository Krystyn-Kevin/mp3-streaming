import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Fisher-Yates shuffle — used to build the shuffled play order without
 * mutating the original queue order (so turning shuffle off restores it).
 */
function shuffleIndices(length, excludeIndex) {
  const indices = Array.from({ length }, (_, i) => i).filter((i) => i !== excludeIndex);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return excludeIndex === undefined ? indices : [excludeIndex, ...indices];
}

const REPEAT_MODES = ["off", "all", "one"];

/**
 * Queue rows need a stable *instance* id, distinct from the song's own id,
 * so the same song can appear twice in a queue and drag-and-drop (dnd-kit)
 * can still tell the rows apart.
 */
function withQueueKey(song) {
  return { ...song, __queueKey: `${song.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
}

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // ------------------------------ state ------------------------------
      queue: [], // array of song objects, in the order they'll play
      currentIndex: -1, // index into `queue`
      isPlaying: false,
      volume: 0.8,
      muted: false,
      shuffle: false,
      shuffleOrder: [], // indices into queue, used when shuffle is on
      repeatMode: "off", // "off" | "all" | "one"
      currentTime: 0,
      duration: 0,

      // --------------------------- derived getters ---------------------------
      getCurrentSong: () => {
        const { queue, currentIndex } = get();
        return currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
      },

      getUpcoming: () => {
        const { queue, currentIndex, shuffle, shuffleOrder } = get();
        if (shuffle && shuffleOrder.length) {
          const posInShuffle = shuffleOrder.indexOf(currentIndex);
          return shuffleOrder.slice(posInShuffle + 1).map((i) => queue[i]);
        }
        return queue.slice(currentIndex + 1);
      },

      // ------------------------------ actions ------------------------------

      /** Replace the queue entirely and start playing at `startIndex`. */
      playQueue: (songs, startIndex = 0) => {
        const queue = songs.map(withQueueKey);
        set({
          queue,
          currentIndex: startIndex,
          isPlaying: true,
          currentTime: 0,
          shuffleOrder: get().shuffle ? shuffleIndices(queue.length, startIndex) : [],
        });
      },

      /** Play a single song immediately, replacing the queue with just that song. */
      playSong: (song) => {
        set({
          queue: [withQueueKey(song)],
          currentIndex: 0,
          isPlaying: true,
          currentTime: 0,
          shuffleOrder: [],
        });
      },

      /** Append to the end of the queue without interrupting playback. */
      addToQueue: (song) => {
        set((state) => ({ queue: [...state.queue, withQueueKey(song)] }));
      },

      /** Insert a song to play right after the current track. */
      playNextInQueue: (song) => {
        set((state) => {
          const queue = [...state.queue];
          queue.splice(state.currentIndex + 1, 0, withQueueKey(song));
          return { queue };
        });
      },

      removeFromQueue: (index) => {
        set((state) => {
          const queue = state.queue.filter((_, i) => i !== index);
          let currentIndex = state.currentIndex;
          if (index < currentIndex) currentIndex -= 1;
          else if (index === currentIndex) {
            // If we removed the currently playing track, stay at the same
            // position (which now holds the next track) unless we removed
            // the last item, in which case stop.
            if (currentIndex >= queue.length) currentIndex = queue.length - 1;
          }
          return { queue, currentIndex, isPlaying: queue.length > 0 && state.isPlaying };
        });
      },

      clearQueue: () => {
        set({ queue: [], currentIndex: -1, isPlaying: false, shuffleOrder: [] });
      },

      reorderQueue: (fromIndex, toIndex) => {
        set((state) => {
          const queue = [...state.queue];
          const [moved] = queue.splice(fromIndex, 1);
          queue.splice(toIndex, 0, moved);

          let currentIndex = state.currentIndex;
          if (fromIndex === currentIndex) {
            currentIndex = toIndex;
          } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
            currentIndex -= 1;
          } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
            currentIndex += 1;
          }
          return { queue, currentIndex };
        });
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (val) => set({ isPlaying: val }),

      next: () => {
        const { queue, currentIndex, shuffle, shuffleOrder, repeatMode } = get();
        if (!queue.length) return;

        if (repeatMode === "one") {
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        if (shuffle && shuffleOrder.length) {
          const pos = shuffleOrder.indexOf(currentIndex);
          const nextPos = pos + 1;
          if (nextPos < shuffleOrder.length) {
            set({ currentIndex: shuffleOrder[nextPos], currentTime: 0, isPlaying: true });
          } else if (repeatMode === "all") {
            const newOrder = shuffleIndices(queue.length);
            set({ shuffleOrder: newOrder, currentIndex: newOrder[0], currentTime: 0, isPlaying: true });
          } else {
            set({ isPlaying: false });
          }
          return;
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < queue.length) {
          set({ currentIndex: nextIndex, currentTime: 0, isPlaying: true });
        } else if (repeatMode === "all") {
          set({ currentIndex: 0, currentTime: 0, isPlaying: true });
        } else {
          set({ isPlaying: false });
        }
      },

      previous: () => {
        const { queue, currentIndex, currentTime, shuffle, shuffleOrder } = get();
        if (!queue.length) return;

        // If more than 3s into the track, "previous" restarts it (standard
        // music-player behavior) rather than jumping tracks.
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        if (shuffle && shuffleOrder.length) {
          const pos = shuffleOrder.indexOf(currentIndex);
          const prevPos = Math.max(0, pos - 1);
          set({ currentIndex: shuffleOrder[prevPos], currentTime: 0 });
          return;
        }

        const prevIndex = Math.max(0, currentIndex - 1);
        set({ currentIndex: prevIndex, currentTime: 0 });
      },

      toggleShuffle: () => {
        set((state) => {
          const shuffle = !state.shuffle;
          return {
            shuffle,
            shuffleOrder: shuffle ? shuffleIndices(state.queue.length, state.currentIndex) : [],
          };
        });
      },

      cycleRepeat: () => {
        set((state) => {
          const idx = REPEAT_MODES.indexOf(state.repeatMode);
          return { repeatMode: REPEAT_MODES[(idx + 1) % REPEAT_MODES.length] };
        });
      },

      setVolume: (volume) => set({ volume, muted: volume === 0 }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),

      setCurrentTime: (t) => set({ currentTime: t }),
      setDuration: (d) => set({ duration: d }),
      seekTo: (t) => set({ currentTime: t }),

      jumpToQueueIndex: (index) => set({ currentIndex: index, currentTime: 0, isPlaying: true }),
    }),
    {
      name: "player-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Don't persist live playback position/isPlaying — a reload should
      // restore the queue, not resume mid-scrub with a stale audio element.
      partialize: (state) => ({
        queue: state.queue,
        currentIndex: state.currentIndex,
        volume: state.volume,
        shuffle: state.shuffle,
        repeatMode: state.repeatMode,
      }),
    }
  )
);

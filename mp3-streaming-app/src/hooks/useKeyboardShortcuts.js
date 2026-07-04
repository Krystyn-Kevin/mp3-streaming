import { useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

/**
 * App-wide playback shortcuts:
 *   Space        Play / pause
 *   Right arrow  Next track
 *   Left arrow   Previous track / restart
 *   Up arrow     Volume up
 *   Down arrow   Volume down
 *   M            Mute / unmute
 *   S            Toggle shuffle
 *   R            Cycle repeat mode
 *
 * Disabled while focus is inside a text input/textarea so typing (e.g. in
 * the search bar) isn't hijacked.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    function isTypingTarget(el) {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      return tag === "input" || tag === "textarea" || el.isContentEditable;
    }

    function handleKeyDown(e) {
      if (isTypingTarget(document.activeElement)) return;

      const store = usePlayerStore.getState();

      switch (e.code) {
        case "Space":
          e.preventDefault();
          store.togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          store.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          store.previous();
          break;
        case "ArrowUp":
          e.preventDefault();
          store.setVolume(Math.min(1, store.volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          store.setVolume(Math.max(0, store.volume - 0.1));
          break;
        case "KeyM":
          store.toggleMute();
          break;
        case "KeyS":
          store.toggleShuffle();
          break;
        case "KeyR":
          store.cycleRepeat();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Storage with progress reporting, resolving to a
 * download URL when complete.
 *
 * @param {File} file
 * @param {string} path - full Storage path, e.g. "audio/uid/167234-song.mp3"
 * @param {(pct: number) => void} onProgress - called with 0-100
 */
export function uploadFileWithProgress(file, path, onProgress) {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(pct);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/** Builds a collision-safe Storage path for an upload. */
export function buildStoragePath(folder, uid, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  return `${folder}/${uid}/${Date.now()}-${safeName}`;
}

/**
 * Best-effort deletion of a song's audio/cover files from Storage. Safe to
 * call with a plain https download URL or a Storage path — works with
 * either the way resolveAudioUrl/resolveCoverArtUrl do. Failures are
 * swallowed (e.g. the file was already removed, or it was an external
 * URL that was never actually in this bucket) since the Firestore
 * document is the source of truth and is deleted regardless.
 */
export async function deleteSongFiles({ audioUrl, coverArt }) {
  for (const value of [audioUrl, coverArt]) {
    if (!value) continue;
    try {
      await deleteObject(ref(storage, value));
    } catch {
      // Not a big deal — see comment above.
    }
  }
}


/**
 * Resolves a playable URL for a song.
 *
 * If `audioUrl` on the Firestore doc is already a full https:// download URL
 * (the common case when it was written at upload time), it's returned as-is.
 * If it's a Storage path instead (e.g. "audio/song123.mp3"), this resolves
 * a fresh download URL via the Storage SDK.
 */
export async function resolveAudioUrl(audioUrl) {
  if (!audioUrl) return null;
  if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) {
    return audioUrl;
  }
  const storageRef = ref(storage, audioUrl);
  return getDownloadURL(storageRef);
}

/** Same idea, for cover art stored as a Storage path rather than a URL. */
export async function resolveCoverArtUrl(coverArt) {
  if (!coverArt) return null;
  if (coverArt.startsWith("http://") || coverArt.startsWith("https://")) {
    return coverArt;
  }
  const storageRef = ref(storage, coverArt);
  return getDownloadURL(storageRef);
}

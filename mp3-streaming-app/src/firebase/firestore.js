import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "./config";

/* ------------------------------- Uploads ------------------------------- */
// Anyone signed in can add to the shared library — see firebase/firestore.rules.
// The uploader's uid/displayName are stamped on the doc for attribution
// ("Added by ..."), not for access control.

export async function createSongDoc(song, uploader) {
  const ref = doc(collection(db, "songs"));
  await setDoc(ref, {
    ...song,
    uploadedAt: serverTimestamp(),
    uploadedBy: uploader?.uid || null,
    uploadedByName: uploader?.displayName || uploader?.email || "Someone",
  });
  return ref.id;
}

export async function subscribeToSongs(onData, onError) {
  const q = query(collection(db, "songs"), orderBy("uploadedAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const songs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(songs);
    },
    (err) => onError?.(err)
  );
}


/* ---------------------------- Favorites ---------------------------- */
// Stored per-user at users/{uid}/favorites/{songId} so they sync across devices.

export function subscribeToFavorites(uid, onData) {
  if (!uid) return () => {};
  const q = collection(db, "users", uid, "favorites");
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => d.id));
  });
}

export async function addFavorite(uid, songId) {
  await setDoc(doc(db, "users", uid, "favorites", songId), {
    addedAt: serverTimestamp(),
  });
}

export async function removeFavorite(uid, songId) {
  await deleteDoc(doc(db, "users", uid, "favorites", songId));
}

/* ------------------------- Playback history ------------------------- */
// Stored per-user at users/{uid}/history/{autoId}

export function subscribeToHistory(uid, onData, maxItems = 50) {
  if (!uid) return () => {};
  const q = query(
    collection(db, "users", uid, "history"),
    orderBy("playedAt", "desc"),
    limit(maxItems)
  );
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function logHistoryEntry(uid, song) {
  if (!uid || !song) return;
  await addDoc(collection(db, "users", uid, "history"), {
    songId: song.id,
    title: song.title,
    artist: song.artist,
    coverArt: song.coverArt || null,
    playedAt: serverTimestamp(),
  });
}

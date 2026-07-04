# Wavelength — Personal Cloud MP3 Player

A production-ready frontend prototype for a personal, cloud-based music streaming app. Built with React + Vite, Tailwind CSS, and Firebase (Authentication, Firestore, Storage).

![stack](https://img.shields.io/badge/React-19-61DAFB) ![stack](https://img.shields.io/badge/Vite-8-646CFF) ![stack](https://img.shields.io/badge/Tailwind-3-38BDF8) ![stack](https://img.shields.io/badge/Firebase-12-FFCA28)

---

## Quick start

```bash
npm install
cp .env.example .env      # already pre-filled with the project's Firebase config
npm run dev
```

Open `http://localhost:5173`. You'll land on the login screen — create an account with email/password or Google, then you're in.

**The `songs` collection starts empty.** See [Seeding sample data](#seeding-sample-data) below to try the app with a few tracks.

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

---

## Folder structure

```
mp3-streaming-app/
├── firebase/
│   ├── firestore.rules       # Firestore security rules
│   ├── storage.rules         # Storage security rules
│   └── sample-songs.json     # sample songs/{songId} documents
├── public/
├── src/
│   ├── firebase/
│   │   ├── config.js         # Firebase app initialization
│   │   ├── auth.js           # sign up / sign in / sign out helpers
│   │   ├── firestore.js      # songs, favorites, history queries
│   │   └── storage.js        # resolves Storage paths -> playable URLs
│   ├── context/
│   │   └── AuthContext.jsx   # current user, exposed via useAuth()
│   ├── store/
│   │   └── usePlayerStore.js # Zustand store: queue, playback, shuffle/repeat
│   ├── hooks/
│   │   ├── useSongs.js            # realtime songs collection subscription
│   │   ├── useFavorites.js        # per-user favorites, synced to Firestore
│   │   ├── useHistory.js          # per-user playback history
│   │   ├── useAudioEngine.js      # owns the single <audio> element
│   │   ├── useKeyboardShortcuts.js
│   │   └── useTheme.js            # dark/light mode toggle
│   ├── components/
│   │   ├── auth/              # LoginForm, RegisterForm, GoogleButton, AuthLayout
│   │   ├── layout/             # Sidebar, TopBar, RightRail, MobileNav, AppShell
│   │   ├── player/             # PlayerBar, TransportControls, SeekBar, VolumeControl
│   │   ├── queue/               # QueuePanel (drag-and-drop), SortableQueueRow
│   │   ├── songs/                # SongTable, SongRow
│   │   └── common/                # ProtectedRoute, SearchBar, CoverArt, Spinner
│   ├── pages/
│   │   ├── LoginPage.jsx / RegisterPage.jsx
│   │   └── HomePage / LibraryPage / QueuePage / RecentlyPlayedPage / FavoritesPage / SettingsPage
│   ├── utils/formatTime.js
│   ├── App.jsx                # routes
│   ├── main.jsx
│   └── index.css              # Tailwind + design tokens (CSS variables for theming)
├── tailwind.config.js
├── .env.example
└── package.json
```

---

## Architecture notes

### Auth
`AuthContext` wraps the app and listens to `onAuthStateChanged`. `browserLocalPersistence` is set explicitly so sessions survive reloads. `ProtectedRoute` redirects unauthenticated users to `/login` and remembers where they were headed so they land back there after signing in. Email/password and Google sign-in are both implemented (`src/firebase/auth.js`); a `users/{uid}` profile doc is created/merged on every login.

### Data model (Firestore)

```
songs/{songId}
  title, artist, composer, album, coverArt, audioUrl, duration, uploadedAt

users/{uid}
  uid, email, displayName, photoURL, lastLoginAt

users/{uid}/favorites/{songId}
  addedAt

users/{uid}/history/{entryId}
  songId, title, artist, coverArt, playedAt
```

This matches the schema in the brief exactly for `songs`; favorites and history are added as per-user subcollections so they sync across devices rather than living only in `localStorage`.

### Playback engine
`useAudioEngine` (in `PlayerBar`) owns the **single** `<audio>` element for the whole app — no per-row `<audio>` tags. It reacts to `usePlayerStore` state (current song, play/pause, volume, seek requests) and pushes native audio events (`timeupdate`, `ended`, etc.) back into the store. `audioUrl` values can be either a ready-to-use `https://` URL or a Storage path — `resolveAudioUrl()` handles both, calling `getDownloadURL()` only for the track that's actually about to play (not the whole library up front).

### Uploads — shared, open library
Any signed-in user can add a song from **Upload** in the sidebar (or `/upload`). The flow (`useSongUpload`):

1. reads the audio file's duration client-side (`getAudioDuration`, via a throwaway `<audio>` element — no upload needed just to measure it)
2. uploads the audio file to `audio/{uid}/{timestamp}-{filename}` in Storage, with live progress
3. optionally uploads cover art the same way, to `covers/{uid}/...`
4. writes a `songs/{id}` document with the resolved download URLs, stamped with `uploadedBy`/`uploadedByName` for attribution

The new song appears for **everyone** immediately — `useSongs` is a live `onSnapshot` subscription, not a one-time fetch, so there's no refresh needed. `firebase/firestore.rules` lets any authenticated user create songs but only edit/delete their own upload (`uploadedBy == request.auth.uid`); `firebase/storage.rules` scopes writes to each user's own uid-prefixed folder with basic size/type checks, while reads (streaming/listening) are open to any signed-in user.

### Queue & state management
`usePlayerStore` (Zustand) holds the queue, current index, shuffle order, repeat mode, and playback position. Queue and playback preferences (not live position) persist to `localStorage` via `zustand/middleware persist`, so your queue survives a refresh. Drag-and-drop reordering uses `@dnd-kit` (`QueuePanel` + `SortableQueueRow`), which handles pointer and keyboard interactions accessibly out of the box.

### Search
Client-side filtering across title/artist/composer/album in `LibraryPage`, fed by a search input in the top bar (state lifted to `AppShell`, passed down via `Outlet` context). Fine for a personal library size; swap in Algolia/Typesense if your library grows into the tens of thousands of tracks.

### Keyboard shortcuts
`useKeyboardShortcuts` (mounted once in `AppShell`) implements Space / arrows / M / S / R, and is disabled automatically while focus is inside a text input so it doesn't fight typing in the search bar.

### Responsive behavior
- **Desktop (lg+)**: sidebar + main + right rail (queue/history) + bottom player bar.
- **Tablet/small desktop**: right rail hides; toggle it from the queue icon in the player bar (renders the same `QueuePanel` inline, or visit `/queue`).
- **Mobile**: sidebar becomes a bottom tab bar; song rows collapse to a stacked layout; player bar controls simplify.

---

## Seeding sample data

The app expects documents in a top-level `songs` collection (see `firebase/sample-songs.json`). Two ways to load them:

**Option A — Firebase console:** Firestore Database → Start collection → `songs` → add documents by hand, copying fields from `sample-songs.json`.

**Option B — Admin SDK script** (faster for more than a couple of songs):

```js
// seed.mjs — run once with: node seed.mjs
import admin from "firebase-admin";
import { readFileSync } from "fs";

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
const { songs } = JSON.parse(readFileSync("./firebase/sample-songs.json", "utf-8"));

for (const song of songs) {
  const { id, uploadedAt, ...rest } = song;
  await db.collection("songs").doc(id).set({
    ...rest,
    uploadedAt: admin.firestore.Timestamp.fromDate(new Date(uploadedAt)),
  });
}
console.log(`Seeded ${songs.length} songs.`);
```

You'll need a service account key for `applicationDefault()` credentials — see the [Admin SDK setup docs](https://firebase.google.com/docs/admin/setup).

For actual audio files, upload MP3s to Firebase Storage under `audio/` and cover art under `covers/`, then either store the Storage path (e.g. `audio/song_002.mp3`) or a resolved download URL in each song's `audioUrl`/`coverArt` field — both are supported.

---

## Deploying security rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

(assumes `firebase/firestore.rules` and `firebase/storage.rules` are referenced in your `firebase.json` — add a `firebase.json` with `"firestore": { "rules": "firebase/firestore.rules" }` and the storage equivalent if you haven't already run `firebase init`.)

The included rules keep `songs` read-only from the client (writes go through a trusted upload flow — an admin script or Cloud Function) while giving each signed-in user full read/write access to their own `favorites` and `history` subcollections, and nothing else.

---

## What's intentionally left as a next step

- **Offline persistence** — `enableIndexedDbPersistence` for Firestore isn't wired up yet; add it to `src/firebase/config.js` if you want the library to render instantly on repeat visits.
- **Virtualized song list** — fine as-is for a personal library of a few hundred tracks; swap `SongTable`'s `.map` for `@tanstack/react-virtual` if yours grows much larger.
- **Moderation** — since any signed-in user can upload, consider adding a report/remove-song admin view if this ever goes beyond a small trusted group.

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
│   └── storage.rules         # Storage security rules
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
│   │   ├── useSongUpload.js       # admin-only: audio+cover upload -> song doc
│   │   ├── useDeleteSong.js       # admin-only: remove song + its files
│   │   ├── useIsAdmin.js          # is the current user the single uploader account?
│   │   ├── useAudioEngine.js      # owns the single <audio> element
│   │   ├── useKeyboardShortcuts.js
│   │   └── useTheme.js            # dark/light mode toggle
│   ├── components/
│   │   ├── auth/              # LoginForm, RegisterForm, GoogleButton, AuthLayout
│   │   ├── layout/             # Sidebar, TopBar, RightRail, MobileNav, AppShell
│   │   ├── player/             # PlayerBar, TransportControls, SeekBar, VolumeControl
│   │   ├── queue/               # QueuePanel (drag-and-drop), SortableQueueRow
│   │   ├── songs/                # SongTable, SongRow
│   │   ├── upload/                # UploadForm, FileDropzone (admin-only)
│   │   └── common/                 # ProtectedRoute, AdminRoute, SearchBar, CoverArt, Spinner
│   ├── pages/
│   │   ├── LoginPage.jsx / RegisterPage.jsx
│   │   └── HomePage / LibraryPage / UploadPage / QueuePage / RecentlyPlayedPage / FavoritesPage / SettingsPage
│   ├── utils/
│   │   ├── formatTime.js
│   │   ├── getAudioDuration.js
│   │   └── constants.js       # ADMIN_EMAIL
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

### Uploads — single admin, open listening
Only the account set as `VITE_ADMIN_EMAIL` (see [Access model](#access-model-one-uploader-everyone-listens) below) sees **Upload** in the sidebar and can add songs from `/upload`; the same account is the only one who sees a remove button on each song row. The upload flow (`useSongUpload`):

1. reads the audio file's duration client-side (`getAudioDuration`, via a throwaway `<audio>` element — no upload needed just to measure it)
2. uploads the audio file to `audio/{uid}/{timestamp}-{filename}` in Storage, with live progress
3. optionally uploads cover art the same way, to `covers/{uid}/...`
4. writes a `songs/{id}` document with the resolved download URLs

The new song appears for **every** signed-in user immediately — `useSongs` is a live `onSnapshot` subscription, not a one-time fetch. Removing a song (`useDeleteSong`) deletes the Firestore doc and best-effort cleans up its Storage files. All of this is enforced server-side in `firebase/firestore.rules` and `firebase/storage.rules`, not just hidden in the UI — see the access model section for the exact setup steps.

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

## Access model: one uploader, everyone listens

This app is set up so that **only one account can add or remove songs**; every other signed-in user can browse and stream everything, but has no write access to the library.

### 1. Set your admin email in three places

These three values must all match exactly (case doesn't matter — comparisons are lowercased):

| Where | What to set |
|---|---|
| `.env` | `VITE_ADMIN_EMAIL=you@example.com` (controls the UI: shows/hides the Upload page and delete buttons) |
| `firebase/firestore.rules` | the email string inside `isAdmin()` at the top of the file |
| `firebase/storage.rules` | the email string inside `isAdmin()` at the top of the file |

The `.env` value alone does **nothing to actually secure anything** — it just hides buttons in the UI. The two `.rules` files are what actually stop other users from writing to the library, since Firestore/Storage rules run on Google's servers regardless of what the client sends.

### 2. Deploy the rules to your Firebase project

Paste the contents of each file into the matching tab in the Firebase console, **or** deploy via CLI — both end up in the same place.

**Firebase console (fastest for a one-off change):**
- Firestore: console.firebase.google.com → your project → **Firestore Database → Rules** tab → paste the contents of `firebase/firestore.rules` → **Publish**.
- Storage: console.firebase.google.com → your project → **Storage → Rules** tab → paste the contents of `firebase/storage.rules` → **Publish**.

**Firebase CLI (better if you'll change rules again later):**

```bash
npm install -g firebase-tools
firebase login
firebase init   # select Firestore and Storage; when it asks for rules file paths, point them at firebase/firestore.rules and firebase/storage.rules
firebase deploy --only firestore:rules,storage:rules
```

If you already ran `firebase init` and have your own `firebase.json`, just make sure it points at these two files:

```json
{
  "firestore": { "rules": "firebase/firestore.rules" },
  "storage": { "rules": "firebase/storage.rules" }
}
```

### 3. Sign in as the admin and upload

Sign up/sign in using the exact email you set above, then use **Upload** in the sidebar (desktop) or bottom tab bar (mobile). Every other account will see the song appear immediately — `useSongs` is a live subscription — but won't see Upload in their nav, won't see a remove button on any song, and would be rejected server-side even if they tried to call the API directly.

---

## What's intentionally left as a next step

- **Offline persistence** — `enableIndexedDbPersistence` for Firestore isn't wired up yet; add it to `src/firebase/config.js` if you want the library to render instantly on repeat visits.
- **Virtualized song list** — fine as-is for a personal library of a few hundred tracks; swap `SongTable`'s `.map` for `@tanstack/react-virtual` if yours grows much larger.
- **Moderation** — since any signed-in user can upload, consider adding a report/remove-song admin view if this ever goes beyond a small trusted group.

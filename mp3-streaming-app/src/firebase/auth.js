import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./config";

// Ensure sessions survive page reloads / browser restarts.
setPersistence(auth, browserLocalPersistence);

/** Create a users/{uid} profile doc the first time someone signs in. */
async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0],
      photoURL: user.photoURL || null,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function registerWithEmail(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function logout() {
  return signOut(auth);
}

/** Maps raw Firebase error codes to friendly, user-facing copy. */
export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists with that email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error — check your connection.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

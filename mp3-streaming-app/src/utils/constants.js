/**
 * The one account allowed to add or remove songs from the shared library.
 * Everyone else can browse and listen, but not modify the library.
 *
 * IMPORTANT: this constant only controls what the *UI* shows (hiding the
 * Upload page/nav item, hiding delete buttons). The actual enforcement
 * happens in firebase/firestore.rules and firebase/storage.rules, which
 * check the same email server-side — a user can't bypass this by editing
 * client code, only by having the rules changed on the Firebase project
 * itself.
 *
 * Set VITE_ADMIN_EMAIL in your .env to your own address, and update the
 * hardcoded email in firestore.rules / storage.rules to match exactly
 * (security rules can't read your .env file — see the comments in those
 * files for the exact line to edit).
 */
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "your-email@example.com").toLowerCase();

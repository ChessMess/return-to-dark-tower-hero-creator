import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
} from "firebase/database";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

const requiredFirebaseEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_DATABASE_URL",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingFirebaseEnvVars = requiredFirebaseEnvVars.filter(
  (name) => !import.meta.env[name],
);

export const hasFirebaseConfig = missingFirebaseEnvVars.length === 0;

if (!hasFirebaseConfig) {
  console.warn(
    `[firebase] Missing env vars: ${missingFirebaseEnvVars.join(", ")}. Gallery/admin features are disabled.`,
  );
}

const firebaseConfig = hasFirebaseConfig
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : null;

const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
export const db = app ? getDatabase(app) : null;
export const auth = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();

export function assertFirebaseAvailable(featureName) {
  if (!hasFirebaseConfig || !db || !auth) {
    throw new Error(
      `${featureName} is unavailable because Firebase is not configured for this deployment.`,
    );
  }
}

/* ── Auth: Google sign-in ── */

export async function signInWithGoogle() {
  assertFirebaseAvailable("Sign in");
  return signInWithPopup(auth, googleProvider);
}

export function getCurrentUser() {
  if (!auth) return null;
  return auth.currentUser;
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return auth.onAuthStateChanged(callback);
}

export async function isAdmin() {
  if (!auth) return false;
  const user = auth.currentUser;
  if (!user) return false;
  const token = await user.getIdTokenResult();
  return token.claims.admin === true;
}

export async function signOutAdmin() {
  assertFirebaseAvailable("Admin sign-out");
  return signOut(auth);
}

/* ── Re-export database utilities for consumers ── */

export {
  ref,
  set,
  get,
  remove,
  update,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
};

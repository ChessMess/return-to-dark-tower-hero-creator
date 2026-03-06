import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
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

const firebaseConfig = {
  apiKey: "REDACTED_FIREBASE_API_KEY",
  authDomain: "rtdt-hero-creator.firebaseapp.com",
  databaseURL: "https://rtdt-hero-creator-default-rtdb.firebaseio.com",
  projectId: "rtdt-hero-creator",
  storageBucket: "rtdt-hero-creator.firebasestorage.app",
  messagingSenderId: "REDACTED_FIREBASE_SENDER_ID",
  appId: "REDACTED_FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* ── Auth: Google sign-in for submissions ── */

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/* ── Submit a hero to pending (requires sign-in) ── */

const SUBMIT_COOLDOWN_MS = 60_000; // 1 minute between submissions
let lastSubmitTime = 0;

async function hashHero(hero) {
  const str = JSON.stringify({
    name: hero.name,
    warriors: hero.warriors,
    spirit: hero.spirit,
    virtues: (hero.virtues || []).map((v) => ({ name: v.name, line1: v.line1, line2: v.line2 })),
  });
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function submitHero(hero) {
  // Require Google sign-in
  let user = auth.currentUser;
  if (!user) {
    const result = await signInWithGoogle();
    user = result.user;
  }
  if (!user) throw new Error("Sign-in required to share a hero.");

  // Reject default/empty heroes
  const DEFAULT_NAMES = ["HERO NAME", ""];
  const DEFAULT_VIRTUE_NAMES = ["VIRTUE", "VIRTUE 1", "VIRTUE 2", "VIRTUE 3", "VIRTUE 4", "VIRTUE 5", "VIRTUE 6"];
  const heroName = (hero.name || "").trim().toUpperCase();
  if (DEFAULT_NAMES.includes(heroName)) {
    throw new Error("Please give your hero a name before sharing.");
  }
  const virtues = hero.virtues || [];
  if (virtues.length === 0) {
    throw new Error("Please add at least one virtue before sharing.");
  }
  const allDefault = virtues.every((v) => DEFAULT_VIRTUE_NAMES.includes((v.name || "").trim().toUpperCase()));
  if (allDefault) {
    throw new Error("Please customize your virtue names before sharing.");
  }

  // Client-side cooldown
  const now = Date.now();
  if (now - lastSubmitTime < SUBMIT_COOLDOWN_MS) {
    const secs = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
    throw new Error(`Please wait ${secs}s before submitting again.`);
  }

  // Sanitize portrait — only allow data: URIs with image MIME types
  let portrait = null;
  if (hero.portraitDataUrl && /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,/.test(hero.portraitDataUrl)) {
    portrait = hero.portraitDataUrl;
  }

  const payload = {
    name: hero.name || "HERO NAME",
    schemaVersion: hero.schemaVersion || 2,
    warriors: hero.warriors,
    spirit: hero.spirit,
    portraitDataUrl: portrait,
    flavorText: hero.flavorText || "",
    bannerAction: hero.bannerAction || "",
    author_name: hero.author_name || "",
    revision_no: hero.revision_no || "",
    description: hero.description || "",
    virtues: hero.virtues || [],
    submittedBy: user.uid,
    createdAt: serverTimestamp(),
  };

  // Reject oversized payloads (>2MB) to protect free-tier storage
  if (portrait && portrait.length > 2_000_000) {
    throw new Error("Hero data is too large to share. Try using a smaller portrait image.");
  }

  // Use content hash as key — Firebase rule (!data.exists()) prevents duplicate submissions
  const hash = await hashHero(hero);
  const heroRef = ref(db, `heroes/pending/${hash}`);
  await set(heroRef, payload);
  lastSubmitTime = Date.now();
  return hash;
}

/* ── Public: Read approved heroes ── */

export async function fetchApprovedHeroes(limit = 50) {
  const q = query(
    ref(db, "heroes/approved"),
    orderByChild("createdAt"),
    limitToLast(limit),
  );
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  const heroes = [];
  snapshot.forEach((child) => {
    heroes.push({ id: child.key, ...child.val() });
  });
  // newest first
  heroes.reverse();
  return heroes;
}

/* ── Admin: Auth ── */

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthChange(callback) {
  return auth.onAuthStateChanged(callback);
}

export { signInWithGoogle as signInAdmin };

export async function signOutAdmin() {
  return signOut(auth);
}

export async function isAdmin() {
  const user = auth.currentUser;
  if (!user) return false;
  const token = await user.getIdTokenResult();
  return token.claims.admin === true;
}

/* ── Admin: Moderation ── */

export async function fetchPendingHeroes() {
  const snapshot = await get(ref(db, "heroes/pending"));
  if (!snapshot.exists()) return [];
  const heroes = [];
  snapshot.forEach((child) => {
    heroes.push({ id: child.key, ...child.val() });
  });
  heroes.reverse();
  return heroes;
}

export async function approveHero(id) {
  const snapshot = await get(ref(db, `heroes/pending/${id}`));
  if (!snapshot.exists()) throw new Error("Hero not found in pending");
  const heroData = snapshot.val();
  heroData.approvedAt = serverTimestamp();
  // Atomic multi-path update: write to approved + delete from pending in one operation
  await update(ref(db), {
    [`heroes/approved/${id}`]: heroData,
    [`heroes/pending/${id}`]: null,
  });
}

export async function rejectHero(id) {
  await remove(ref(db, `heroes/pending/${id}`));
}

export async function deleteApprovedHero(id) {
  await remove(ref(db, `heroes/approved/${id}`));
}

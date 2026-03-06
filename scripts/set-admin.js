#!/usr/bin/env node

// One-time script to set the admin custom claim on your Firebase user account.
//
// Prerequisites:
//   npm install firebase-admin   (in this directory or globally)
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/set-admin.js your@email.com
//
// After running, sign out and back in to the app for the claim to take effect.

import admin from "firebase-admin";

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin.js <email>");
  process.exit(1);
}

admin.initializeApp();

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    console.log(`Found user: ${user.uid} (${user.email})`);
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`Admin claim set for ${email}`);
    console.log("Sign out and back in to the app for the claim to take effect.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });

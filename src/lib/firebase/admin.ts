import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebasePrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();

  if (!privateKey) {
    return undefined;
  }

  return privateKey
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirebaseAdminApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getFirebasePrivateKey(),
      }),
    });
  } catch (error) {
    console.warn(
      "Firebase Admin could not initialize. Falling back to env-based auth roles.",
      error,
    );

    return null;
  }
}

export function getDb() {
  const app = getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  return getFirestore(app);
}

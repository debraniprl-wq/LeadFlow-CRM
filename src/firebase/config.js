// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Replace the placeholder values below with your actual Firebase
// project credentials from: https://console.firebase.google.com
//
// Steps:
// 1. Go to Firebase Console → Your Project → Project Settings
// 2. Scroll to "Your apps" → Web App → SDK setup and configuration
// 3. Copy the firebaseConfig object and paste the values here
// ============================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const isDemoMode = firebaseConfig.apiKey === "YOUR_API_KEY";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);

// Initialize Cloud Firestore and export
export const db = getFirestore(app);

export default app;

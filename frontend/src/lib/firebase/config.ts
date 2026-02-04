import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9nAd3Y739Nk7shY8FCoBOqdW6Tj6PR6o",
  authDomain: "user-login-data-7d185.firebaseapp.com",
  projectId: "user-login-data-7d185",
  storageBucket: "user-login-data-7d185.firebasestorage.app",
  messagingSenderId: "7246341283",
  appId: "1:7246341283:web:a521347c7192897a164b16",
  measurementId: "G-SN2PGZER46"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
// src/lib/firebase.js
"use client";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDe00nN8nAH_wajUEbLQO6X96xUVDZ2ciQ",
  authDomain: "news-blog-4a630.firebaseapp.com",
  projectId: "news-blog-4a630",
  storageBucket: "news-blog-4a630.firebasestorage.app",
  messagingSenderId: "170842421594",
  appId: "1:170842421594:web:5f05835c2abda3bc31db63"
};

const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
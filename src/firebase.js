// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz04kWGUorfz29DgNg3VY78czj3-kzF8M",
  authDomain: "ipay-a3717.firebaseapp.com",
  projectId: "ipay-a3717",
  storageBucket: "ipay-a3717.firebasestorage.app",
  messagingSenderId: "239382298826",
  appId: "1:239382298826:web:69dbac6acdcb9fdbc33433",
  measurementId: "G-F2GGT51WF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
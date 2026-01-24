import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABJ72-4omVsOaPuzLdPqCyle1TNlohgnE",
    authDomain: "firestore-database-5c1ad.firebaseapp.com",
    projectId: "firestore-database-5c1ad",
    storageBucket: "firestore-database-5c1ad.firebasestorage.app",
    messagingSenderId: "279840876052",
    appId: "1:279840876052:web:9c9b3703d15a25be72a901",
    measurementId: "G-2XN8PKBR8H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

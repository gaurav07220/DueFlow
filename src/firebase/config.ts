import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  projectId: "studio-319457900-29a19",
  appId: "1:159956220814:web:6a658e67d0c5b6aa2142df",
  apiKey: "AIzaSyC-lul1Z_GsLNnptGSj0DqQf7YYLp-2oZA",
  authDomain: "studio-319457900-29a19.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "159956220814",
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Export Firestore instance
export const db = getFirestore(app);

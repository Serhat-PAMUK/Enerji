import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPfGVfvK358A79yVpuseKQcNBaLoTl6MQ",
  authDomain: "vtys-mail-dogrulama.firebaseapp.com",
  projectId: "vtys-mail-dogrulama",
  storageBucket: "vtys-mail-dogrulama.firebasestorage.app",
  messagingSenderId: "1025024052462",
  appId: "1:1025024052462:web:d32bcac3c9ab2ea51b37ff",
  measurementId: "G-2SJXR02CEJ"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export const db = getFirestore(app);

// Export auth explicitly
export { auth };
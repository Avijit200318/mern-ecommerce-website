// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-website-bc9dc.firebaseapp.com",
  projectId: "ecommerce-website-bc9dc",
  storageBucket: "ecommerce-website-bc9dc.appspot.com",
  messagingSenderId: "109444167661",
  appId: "1:109444167661:web:adc31c8651c8be1c5299e4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
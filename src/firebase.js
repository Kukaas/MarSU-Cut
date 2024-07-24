// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "garments-d13bf.firebaseapp.com",
  projectId: "garments-d13bf",
  storageBucket: "garments-d13bf.appspot.com",
  messagingSenderId: "1040187352325",
  appId: "1:1040187352325:web:5928e616842877dbc5436c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

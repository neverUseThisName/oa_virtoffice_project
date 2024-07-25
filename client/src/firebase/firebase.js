// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCptJ6Y4k9iFNrzXrqDS1Lz2_7L-RjOl-c",
  authDomain: "oa-office-3c23f.firebaseapp.com",
  projectId: "oa-office-3c23f",
  storageBucket: "oa-office-3c23f.appspot.com",
  messagingSenderId: "773587442263",
  appId: "1:773587442263:web:4d189164c0060e42836112",
  measurementId: "G-925VE0KJP3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

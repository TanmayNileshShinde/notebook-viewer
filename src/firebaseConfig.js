// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhP821EVKdrWWrYvYqFu7locnc5E9VumM",
  authDomain: "notebook-viewer-9798.firebaseapp.com",
  projectId: "notebook-viewer-9798",
  storageBucket: "notebook-viewer-9798.firebasestorage.app",
  messagingSenderId: "1075715055322",
  appId: "1:1075715055322:web:0ec05c0282a98ca62dcfe3",
  measurementId: "G-Z0VG6MKMLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
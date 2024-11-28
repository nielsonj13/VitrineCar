// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0xbq6SwksrniZRLoq5tfAZ11ntUpd29Q",
  authDomain: "vitrinecar-71a27.firebaseapp.com",
  projectId: "vitrinecar-71a27",
  storageBucket: "vitrinecar-71a27.firebasestorage.app",
  messagingSenderId: "826430355367",
  appId: "1:826430355367:web:f29148faffc6e0cd13e882",
  measurementId: "G-5MWCQB0RJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let config = {
    apiKey: "AIzaSyAboi3qFXrNKGlWNNhoAbKDOG0WN6G2GYc",
    authDomain: "vitrinecar-cddd4.firebaseapp.com",
    projectId: "vitrinecar-cddd4",
    storageBucket: "vitrinecar-cddd4.firebasestorage.app",
    messagingSenderId: "814466508411",
    appId: "1:814466508411:web:2ee61d239ac488979724de",
    measurementId: "G-Z4D986WCHE"
};

const firebaseApp = initializeApp(config);

export const firestore = getFirestore(firebaseApp);
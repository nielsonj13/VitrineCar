import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa o Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyA0xbq6SwksrniZRLoq5tfAZ11ntUpd29Q",
  authDomain: "vitrinecar-71a27.firebaseapp.com",
  projectId: "vitrinecar-71a27",
  storageBucket: "vitrinecar-71a27.firebasestorage.app",
  messagingSenderId: "826430355367",
  appId: "1:826430355367:web:f29148faffc6e0cd13e882",
  measurementId: "G-5MWCQB0RJE"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializa o Firestore
const storage = getStorage(app); // Inicializa o Firebase Storage

export { db, storage }; // Exporta tanto o Firestore quanto o Firebase Storage

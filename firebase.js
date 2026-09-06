
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBL8nAyASRxz8SSY7eibvrN6Ytp6B1nSWg',
  authDomain: 'biomind-c1ea1.firebaseapp.com',
  projectId: 'biomind-c1ea1',
  storageBucket: 'biomind-c1ea1.firebasestorage.app',
  messagingSenderId: '34990659998',
  appId: '1:34990659998:web:8d902b840144c8c6fd1e8f',
  measurementId: 'G-54GH4LYKNG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

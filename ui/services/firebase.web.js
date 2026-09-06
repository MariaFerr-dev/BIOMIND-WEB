import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = getApps().length ? getApp() : initializeApp({
  apiKey: 'AIzaSyBL8nAyASRxz8SSY7eibvrN6Ytp6B1nSWg',
  authDomain: 'biomind-c1ea1.firebaseapp.com',
  projectId: 'biomind-c1ea1',
  storageBucket: 'biomind-c1ea1.firebasestorage.app',
  messagingSenderId: '34990659998',
  appId: '1:34990659998:web:8d902b840144c8c6fd1e8f',
  measurementId: 'G-54GH4LYKNG',
});
export const auth = getAuth(app);
auth.languageCode = 'es';
export const db = getFirestore(app);

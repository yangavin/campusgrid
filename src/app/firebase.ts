// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {};
if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  firebaseConfig = {
    apiKey: 'AIzaSyD8KsYtpngNoosnUCtWLHpvRrwSoN1KiSs',
    authDomain: 'campusgrid-98eda.firebaseapp.com',
    projectId: 'campusgrid-98eda',
    storageBucket: 'campusgrid-98eda.firebasestorage.app',
    messagingSenderId: '550928053841',
    appId: '1:550928053841:web:fb7598147c2f3baf722a70',
    measurementId: 'G-CPWHFD228T',
  };
} else {
  firebaseConfig = {
    apiKey: 'AIzaSyD8KsYtpngNoosnUCtWLHpvRrwSoN1KiSs',
    authDomain: 'campusgrid-98eda.firebaseapp.com',
    projectId: 'campusgrid-98eda',
    storageBucket: 'campusgrid-98eda.firebasestorage.app',
    messagingSenderId: '550928053841',
    appId: '1:550928053841:web:fb7598147c2f3baf722a70',
    measurementId: 'G-CPWHFD228T',
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const checkAnalytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

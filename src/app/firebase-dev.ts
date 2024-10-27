// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwcTXhl8f8KxpzauW3n9Thco_-VvW7AwA",
  authDomain: "affyto-dev.firebaseapp.com",
  projectId: "affyto-dev",
  storageBucket: "affyto-dev.appspot.com",
  messagingSenderId: "116671647659",
  appId: "1:116671647659:web:20306205278992a3f58cee",
  measurementId: "G-NSS9F0K2BM",
};

export const environment = () => {
  console.log(process.env.NEXT_PUBLIC_ENV || "development");
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {};
let admissionLink: string;
if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  firebaseConfig = {
    apiKey: "AIzaSyDwcTXhl8f8KxpzauW3n9Thco_-VvW7AwA",
    authDomain: "affyto-dev.firebaseapp.com",
    projectId: "affyto-dev",
    storageBucket: "affyto-dev.appspot.com",
    messagingSenderId: "116671647659",
    appId: "1:116671647659:web:20306205278992a3f58cee",
    measurementId: "G-NSS9F0K2BM",
  };
  admissionLink = "https://check-admission-x3avzzjfra-uc.a.run.app";
} else {
  firebaseConfig = {
    apiKey: "AIzaSyC7sEXn2SmciBgutYShg55oyM30Rx86_18",
    authDomain: "affyto-5a803.firebaseapp.com",
    projectId: "affyto-5a803",
    storageBucket: "affyto-5a803.appspot.com",
    messagingSenderId: "83423356187",
    appId: "1:83423356187:web:594d444efb9168c79f9fbe",
    measurementId: "G-8PVXEMJCN5",
  };
  admissionLink = "https://check-admission-ctxn6toyqq-uc.a.run.app";
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { admissionLink };

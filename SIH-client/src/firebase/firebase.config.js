// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-JnB2o-0DKFmDfDvQ2pIoC2JviMj7TyY",
  authDomain: "mern-book-inventory-7bcc1.firebaseapp.com",
  projectId: "mern-book-inventory-7bcc1",
  storageBucket: "mern-book-inventory-7bcc1.appspot.com",
  messagingSenderId: "740524239236",
  appId: "1:740524239236:web:a27e98dd9d09c00f21d5d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
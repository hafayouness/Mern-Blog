// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-3743c.firebaseapp.com",
  projectId: "mern-blog-3743c",
  storageBucket: "mern-blog-3743c.appspot.com",
  messagingSenderId: "824058627760",
  appId: "1:824058627760:web:9665900f91b5a3177d1d75",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

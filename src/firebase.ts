// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


// firebase.ts に追加
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNymTKi2rW8A2LlvsK1hMyqCx4S9Z_RkQ",
  authDomain: "toefltyping.firebaseapp.com",
  projectId: "toefltyping",
  storageBucket: "toefltyping.firebasestorage.app",
  messagingSenderId: "607600330947",
  appId: "1:607600330947:web:82b8bdf79ff0f028553a76",
  measurementId: "G-ZBJFK3XEHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
 //dbをエクスポート
 export {db};
 export const auth = getAuth(app);
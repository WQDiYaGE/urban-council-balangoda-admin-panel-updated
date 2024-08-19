// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAp2COaKXVAshvGsfgiA_ptlKuyL8EGwbg",
    authDomain: "councillor-app-6f118.firebaseapp.com",
    projectId: "councillor-app-6f118",
    storageBucket: "councillor-app-6f118.appspot.com",
    messagingSenderId: "685621499578",
    appId: "1:685621499578:web:815fca4d3155aff5a85483"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth, storage };

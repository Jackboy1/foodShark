// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzieavm0Moy5C3elBcPZill4sjWGLHcQQ",
  authDomain: "foodshark-1e531.firebaseapp.com",
  databaseURL: "https://foodshark-1e531-default-rtdb.firebaseio.com",
  projectId: "foodshark-1e531",
  storageBucket: "foodshark-1e531.firebasestorage.app",
  messagingSenderId: "187382554085",
  appId: "1:187382554085:web:489bb2f35cf17313b1230c",
  measurementId: "G-KGVC7VEVX8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Realtime Database instance
export const database = getDatabase(app);
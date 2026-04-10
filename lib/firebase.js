import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALo93JYZaR7PwcaaHCFG3jZCHzTc_8Rlg",
  appId: "1:717165133394:android:89a63c02e0765f7995298b",
  messagingSenderId: "717165133394",
  projectId: "lgtv2-e14cf",
  storageBucket: "lgtv2-e14cf.firebasestorage.app",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

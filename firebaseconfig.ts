import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB9wVLOmxUu9OEmtRCTntIIWac_t9qxEYg",
    authDomain: "reactnative-dcc03.firebaseapp.com",
    databaseURL: "https://reactnative-dcc03-default-rtdb.firebaseio.com",
    projectId: "reactnative-dcc03",
    storageBucket: "reactnative-dcc03.firebasestorage.app",
    messagingSenderId: "20439701153",
    appId: "1:20439701153:web:0890dc9487c3311863c2e0",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { app, db };

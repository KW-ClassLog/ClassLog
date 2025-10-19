// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { Messaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyCR4eTgzcftk7X3NsJsYxZsQGGABAwPbS0",
    authDomain: "claog-1e23b.firebaseapp.com",
    projectId: "claog-1e23b",
    storageBucket: "claog-1e23b.firebasestorage.app",
    messagingSenderId: "489862012918",
    appId: "1:489862012918:web:152e04239532f7674731d7",
    measurementId: "G-E5J4K9Q5F0"
};

const app = initializeApp(firebaseConfig);

// 브라우저 환경에서만 messaging 가져오기
export function getFirebaseMessaging(): Messaging | null {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
        try {
            return getMessaging(app);
        } catch (err) {
            console.warn("FCM 초기화 실패:", err);
            return null;
        }
    }
    return null;
}
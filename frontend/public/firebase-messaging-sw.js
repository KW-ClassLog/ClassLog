// Firebase SDK import (compat 버전, 서비스워커는 importScripts 방식)
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// Firebase 초기화 (환경변수 값 대신 실제 Firebase 설정을 그대로 작성)
firebase.initializeApp({
  apiKey: "AIzaSyCR4eTgzcftk7X3NsJsYxZsQGGABAwPbS0",
  authDomain: "claog-1e23b.firebaseapp.com",
  projectId: "claog-1e23b",
  storageBucket: "claog-1e23b.firebasestorage.app",
  messagingSenderId: "489862012918",
  appId: "1:489862012918:web:152e04239532f7674731d7",
  measurementId: "G-E5J4K9Q5F0"
});

// Firebase Messaging 인스턴스 (자동으로 알림 표시 처리)
firebase.messaging();

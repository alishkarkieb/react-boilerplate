// This file is static. It does NOT use "import" or "export".
// It uses "importScripts" to load the Firebase SDK in the background.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDt2d1yh7KU4kkEFPo41gAAqdYt-6fi37k",
  authDomain: "eb-base.firebaseapp.com",
  projectId: "eb-base",
  storageBucket: "eb-base.firebasestorage.app",
  messagingSenderId: "823848757574",
  appId: "1:823848757574:web:4e0708822b3cce14351d47",
  measurementId: "G-LB5FWTELWW"
});

const messaging = firebase.messaging();

// This is the magic part that handles notifications when the tab is closed
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const { title, body, icon } = payload.notification;
  
  self.registration.showNotification(title, {
    body,
    icon,
  });
});
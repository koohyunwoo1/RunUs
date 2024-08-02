// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


// // install event
// self.addEventListener("install", (e) => {
//     console.log("[Service Worker] installed");
//   });
  
//   // activate event
//   self.addEventListener("activate", (e) => {
//     console.log("[Service Worker] actived", e);
//   });
  
//   // fetch event
//   self.addEventListener("fetch", (e) => {
//     console.log("[Service Worker] fetched resource " + e);
//     console.log("[Service Worker] fetched resource " + e.request.url);
//   });

//   // Firebase 초기화 및 백그라운드 메시지 처리
// firebase.initializeApp({
//   apiKey: "AIzaSyBGGIiIjM5G4oPfmlysQOX_2DnYuTzxXxE",
//   authDomain: "pwa-exam-a772a.firebaseapp.com",
//   projectId: "pwa-exam-a772a",
//   storageBucket: "pwa-exam-a772a.appspot.com",
//   messagingSenderId: "176738710469",
//   appId: "1:176738710469:web:d5f71edf902445aacdd1ac",
//   measurementId: "G-P5S7Q5NE88"
// });

// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message: ', payload);
//   // 알림 표시 로직
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/public/icons/icon-192x192.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBGGIiIjM5G4oPfmlysQOX_2DnYuTzxXxE",
  authDomain: "pwa-exam-a772a.firebaseapp.com",
  projectId: "pwa-exam-a772a",
  storageBucket: "pwa-exam-a772a.appspot.com",
  messagingSenderId: "176738710469",
  appId: "1:176738710469:web:d5f71edf902445aacdd1ac",
  measurementId: "G-P5S7Q5NE88"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

self.addEventListener("install", (e) => {
  console.log("[Service Worker] installed");
});

self.addEventListener("activate", (e) => {
  console.log("[Service Worker] activated", e);
});

self.addEventListener("fetch", (e) => {
  console.log("[Service Worker] fetched resource ", e.request.url);
});

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
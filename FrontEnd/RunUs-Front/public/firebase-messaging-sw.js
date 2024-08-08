// self.addEventListener("install", (e) => {
//   console.log("[Service Worker] installed");
// });

// self.addEventListener("activate", (e) => {
//   console.log("[Service Worker] activated", e);
// });

// self.addEventListener("fetch", (e) => {
//   console.log("[Service Worker] fetched resource ", e.request.url);
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


messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  
  if (payload.data && payload.data.source === 'server') {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    sound: '/notification-sound.wav'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
}
});

self.addEventListener('push', function(event) {
  const payload = event.data.json();
  if (payload.data && payload.data.source === 'server') {
  const options = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    sound: '/notification-sound.mp3'
  };

  event.waitUntil(
    self.registration.showNotification(payload.notification.title, options)
  );
}
});


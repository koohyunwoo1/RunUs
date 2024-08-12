import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBGGIiIjM5G4oPfmlysQOX_2DnYuTzxXxE",
  authDomain: "pwa-exam-a772a.firebaseapp.com",
  projectId: "pwa-exam-a772a",
  storageBucket: "pwa-exam-a772a.appspot.com",
  messagingSenderId: "176738710469",
  appId: "1:176738710469:web:d5f71edf902445aacdd1ac",
  measurementId: "G-P5S7Q5NE88"
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

export { messaging };
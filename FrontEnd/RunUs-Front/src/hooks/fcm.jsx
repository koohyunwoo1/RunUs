// import { getToken, onMessage } from '.firebase/messaging';
// import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';



export const requestPermissionAndGetToken = async () => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, { vapidKey: 'BCpoEnMBbhsZk7yUTELkZw7zAzb7ikaHE0uiIVLR4gTeX8BpM2Mab52k4M-_ljDNJC8bY2FQkCpU1ngEQ0KSF5E' });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.log('FCM 권한 요청 실패:', error);
    return null;
  }
};

export const sendTokenToServer = async (userId, token) => {
  try {
    const response = await fetch('https://localhost:8000/api/v1/fcm/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, token }),
    });
    if (response.ok) {
      console.log('Token sent to server successfully');
    } else {
      const errorData = await response.text();
      console.error('Failed to send token to server:', response.status, errorData);
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

export const deleteTokenFromServer = async (userId) => {
  try {
    const response = await fetch(`https://localhost:8000/api/v1/fcm/user/${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Token deleted from server successfully');
    } else {
      const errorData = await response.text();
      console.error('Failed to delete token from server:', response.status, errorData);
    }
  } catch (error) {
    console.error('Error deleting token from server:', error);
  }
};

export const setupMessageListener = () => {
  return onMessage(messaging, (payload) => {
    console.log('Received foreground message: ', payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/icons/icon-192x192.png'
    });
  });
};
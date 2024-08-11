import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

export const requestPermissionAndGetToken = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // 기존 토큰 확인
    let token = await getToken(messaging, {
      vapidKey:
        "BG9r1ai5Pcs4Le50pRzuQ-xNGJv9L5DmS0Ij2nKMyZ7hsD3RPSPLXqdLJRwHqJ_KDrdo_yL-Uj87VypyTC90rV8",
    });

    if (token) {
      console.log("FCM Token:", token);
      await sendTokenToServer(userId, token);
      return token;
    } else {
      console.log("No registration token available. Attempting to refresh.");
      token = await refreshToken(userId);
      return token;
    }
  } catch (error) {
    console.log("FCM 권한 요청 실패:", error);
    return null;
  }
};

export const sendTokenToServer = async (userId, token) => {
  try {
    //https://i11e103.p.ssafy.io:8001/
    //https://localhost:8000
    const response = await fetch(
      "https://i11e103.p.ssafy.io:8003/api/v1/fcm/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, token }),
      }
    );
    if (response.ok) {
      console.log("Token sent to server successfully");
    } else {
      const errorData = await response.text();
      console.error(
        "Failed to send token to server:",
        response.status,
        errorData
      );
    }
  } catch (error) {
    console.error("Error sending token to server:", error);
  }
};

export const deleteTokenFromServer = async (userId) => {
  try {
    const response = await fetch(
      `https://i11e103.p.ssafy.io:8003/api/v1/fcm/user/${userId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      console.log("Token deleted from server successfully");
    } else {
      const errorData = await response.text();
      console.error(
        "Failed to delete token from server:",
        response.status,
        errorData
      );
    }
  } catch (error) {
    console.error("Error deleting token from server:", error);
  }
};

export const setupMessageListener = (userId) => {
  const unsubscribe = onMessage(messaging, async (payload) => {
    console.log("Message received. ", payload);

    if (payload.data && payload.data.source === "server") {
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/icons/icon-192x192.png",
      };

      if (Notification.permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(
            notificationTitle,
            notificationOptions
          );
        } catch (error) {
          console.error("Notification display error:", error);
          if (error.code === "messaging/token-unsubscribe-failed") {
            await refreshToken(userId);
          }
        }
      } else {
        console.log("Notification permission not granted");
      }
    }
  });

  return unsubscribe;
};

export const refreshToken = async (userId) => {
  try {
    // 기존 토큰 삭제 대신 새 토큰 생성
    const newToken = await getToken(messaging, {
      vapidKey:
        "BG9r1ai5Pcs4Le50pRzuQ-xNGJv9L5DmS0Ij2nKMyZ7hsD3RPSPLXqdLJRwHqJ_KDrdo_yL-Uj87VypyTC90rV8",
    });
    console.log("New FCM Token:", newToken);

    if (newToken) {
      // 새 토큰을 서버에 전송
      await sendTokenToServer(userId, newToken);
    } else {
      // 토큰을 받지 못한 경우 서버에서 기존 토큰 삭제
      await deleteTokenFromServer(userId);
    }

    return newToken;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    // 에러 발생 시 서버에서 토큰 삭제
    await deleteTokenFromServer(userId);
    return null;
  }
};

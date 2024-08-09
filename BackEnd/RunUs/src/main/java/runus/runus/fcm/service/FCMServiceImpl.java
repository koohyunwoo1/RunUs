package runus.runus.fcm.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import runus.runus.fcm.dao.FCMTokenDAO;
import runus.runus.fcm.dto.FCMTokenDTO;
import runus.runus.fcm.dto.NotificationDTO;

@Service
public class FCMServiceImpl implements FCMService {
    @Autowired
    private FCMTokenDAO fcmTokenDAO;

    @Override
    public void saveToken(String userId, String token) {
//        fcmTokenDAO.saveToken(userId, token);
        System.out.println("saveToken start");
        String existingToken = fcmTokenDAO.getToken(userId);
        if (existingToken == null || !existingToken.equals(token)) {
            fcmTokenDAO.saveToken(userId, token);
            System.out.println("Token saved for user: " + userId);
            System.out.println("saveToken end");
        } else {
            System.out.println("Token already exists for user: " + userId);
        }
    }

    @Override
    public void deleteToken(String userId) {
        fcmTokenDAO.deleteToken(userId);
        System.out.println("Token deleted for user: " + userId);
        System.out.println("call deleteToken");
    }


    @Override
    public void sendNotification(String userId, NotificationDTO notification) throws FirebaseMessagingException {
        System.out.println("sendNotification start");
        String token = fcmTokenDAO.getToken(userId);
        System.out.println("TOKEN: " + token);
        if (token != null) {
            System.out.println("in if");
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(notification.getTitle())
                            .setBody(notification.getBody())
                            .build())
                    .putData("source", "server")
                    .build();
            System.out.println(message);

            try {
                if (FirebaseApp.getApps().isEmpty()) {
                    throw new IllegalStateException("Firebase has not been initialized");
                }
                String response = FirebaseMessaging.getInstance().send(message);
                System.out.println("Successfully sent message: " + response);

            }catch (FirebaseMessagingException  e) {
//                System.err.println("Error sending message: " + e.getMessage());
//                e.printStackTrace();
                if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED) {
                    System.out.println("Token is no longer valid. Removing token for user: " + userId);
//                    fcmTokenDAO.deleteToken(userId);
                }
                throw e;
            }
        } else {
            System.out.println("No valid token found for user: " + userId);
            System.out.println("call sendNotification");
            throw new IllegalStateException("No valid token found for user: " + userId);
        }
    }

}

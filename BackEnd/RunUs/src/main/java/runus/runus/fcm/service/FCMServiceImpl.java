package runus.runus.fcm.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.fcm.dao.FCMTokenDAO;
import runus.runus.fcm.dto.NotificationDTO;

@Service
public class FCMServiceImpl implements FCMService {
    @Autowired
    private FCMTokenDAO fcmTokenDAO;

    @Override
    public void saveToken(String userId, String token) {
        fcmTokenDAO.saveToken(userId, token);
    }

    //    @Override
//    public void deleteToken(String userId) {
//        fcmTokenDAO.deleteToken(userId);
//    }
    @Override
    public void deleteToken(String userId) {
        fcmTokenDAO.deleteToken(userId);
        System.out.println("Token deleted from database for user: " + userId);
    }

    //    @Override
//    public void sendNotification(String userId, NotificationDTO notification) throws FirebaseMessagingException {
//        String token = fcmTokenDAO.getToken(userId);
//        if (token != null) {
//            Message message = Message.builder()
//                    .setToken(token)
//                    .setNotification(Notification.builder()
//                            .setTitle(notification.getTitle())
//                            .setBody(notification.getBody())
//                            .build())
//                    .build();
//
//            String response = FirebaseMessaging.getInstance().send(message);
//            System.out.println("Successfully sent message: " + response);
//        }
//    }
    @Override
    public void sendNotification(String userId, NotificationDTO notification) throws FirebaseMessagingException {
        String token = fcmTokenDAO.getToken(userId);
        if (token != null) {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(Notification.builder()
                                .setTitle(notification.getTitle())
                                .setBody(notification.getBody())
                                .build())
                        .build();

                String response = FirebaseMessaging.getInstance().send(message);
                System.out.println("Successfully sent message: " + response);
            } catch (FirebaseMessagingException e) {
                if (e.getMessagingErrorCode() == com.google.firebase.messaging.MessagingErrorCode.UNREGISTERED) {
                    System.out.println("Token is no longer valid, deleting from database");
                    fcmTokenDAO.deleteToken(userId);
                }
                throw e;
            }
        } else {
            System.out.println("No valid token found for user: " + userId);
        }
    }
}

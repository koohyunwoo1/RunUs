package runus.runus.fcm.service;

import com.google.firebase.messaging.FirebaseMessagingException;
import runus.runus.fcm.dto.NotificationDTO;

public interface FCMService {
    void saveToken(String userId, String token);
    void deleteToken(String userId);
    void sendNotification(String userId, NotificationDTO notification) throws FirebaseMessagingException;
}

package runus.runus.fcm.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.fcm.dto.FCMTokenDTO;
import runus.runus.fcm.dto.NotificationDTO;
import runus.runus.fcm.service.FCMService;

@RestController
@RequestMapping("/api/v1/fcm")
public class FCMController {
    @Autowired
    private FCMService fcmService;  // 인터페이스를 주입받음

    @PostMapping("/user")
    public ResponseEntity<?> registerToken(@RequestBody FCMTokenDTO tokenDTO) {
        fcmService.saveToken(tokenDTO.getUserId(), tokenDTO.getToken());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteToken(@PathVariable String userId) {
        fcmService.deleteToken(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/notification")
    public ResponseEntity<?> sendNotification(@PathVariable String userId, @RequestBody NotificationDTO notificationDTO) throws FirebaseMessagingException {
        fcmService.sendNotification(userId, notificationDTO);
        return ResponseEntity.ok().build();
    }
}

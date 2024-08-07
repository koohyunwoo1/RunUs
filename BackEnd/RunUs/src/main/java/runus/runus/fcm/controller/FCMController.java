package runus.runus.fcm.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        try {
            fcmService.saveToken(tokenDTO.getUserId(), tokenDTO.getToken());
            System.out.println("call registerToken(controller)");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering token");
        }
    }


    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteToken(@PathVariable String userId) {
        fcmService.deleteToken(userId);
        System.out.println("call deleteToken(controller)");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/notification")
    public ResponseEntity<?> sendNotification(@PathVariable String userId, @RequestBody NotificationDTO notificationDTO) throws FirebaseMessagingException {
        System.out.println("call sendNotification(controller) start");
        fcmService.sendNotification(userId, notificationDTO);
        System.out.println("call sentNotification(controller)");
        return ResponseEntity.ok().build();
    }
}

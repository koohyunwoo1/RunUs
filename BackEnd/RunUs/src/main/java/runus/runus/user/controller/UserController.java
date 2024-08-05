package runus.runus.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import runus.runus.user.dto.UserDto;
import runus.runus.user.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userDto);
        return createResponse(true, updatedUser, "회원 정보 수정 성공");
    }

    @GetMapping("/search-email")
    public ResponseEntity<?> searchEmail(@RequestParam String phoneNumber) {
        String email = userService.searchEmail(phoneNumber);
        Map<String, String> data = new HashMap<>();
        data.put("email", email);
        return createResponse(true, data, "이메일 찾기 성공");
    }

    @PostMapping("/search-password")
    public ResponseEntity<?> searchPassword(@RequestBody Map<String, String> credentials) {
        String password = userService.searchPassword(credentials.get("email"), credentials.get("phoneNumber"));
        Map<String, String> data = new HashMap<>();
        data.put("password", password);
        return createResponse(true, data, "비밀번호 찾기 성공");
    }

    @GetMapping("/search-profile")
    public ResponseEntity<?> searchProfile(@RequestParam Integer userId) {
        UserDto userProfile = userService.getUserProfile(userId);
        return createResponse(true, userProfile, "프로필 조회 성공");
    }

    @PostMapping("/profile")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("userId") Integer userId,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            String profileUrl = userService.storeProfilePicture(userId, file);
            Map<String, String> data = new HashMap<>();
            data.put("profileUrl", profileUrl);
            return ResponseEntity.ok(createResponse(true, data, "프로필 변경 성공"));
        } catch (Exception e) {
            // 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse(false, null, "프로필 사진 변경 실패: " + e.getMessage()));
        }
    }



    private ResponseEntity<?> createResponse(boolean success, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("data", data);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
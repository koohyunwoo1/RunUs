package runus.runus.auth.controller;

import com.example.runus.api.ApiResponse;
import com.example.runus.auth.service.AuthService;
import com.example.runus.user.dto.UserDto;
import com.example.runus.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @Autowired
    private AuthService authService;

    //    @PostMapping("/signup")
//    public ResponseEntity<?> signup(@RequestBody UserDto userDto) {
//        UserDto signedUpUser = authService.signup(userDto);
//        System.out.println("회원가입 요청");
//        return ResponseEntity.ok(new HashMap<String, Object>() {{
//            put("success", true);
//            put("data", signedUpUser);
//            put("message", "회원 가입 성공");
//        }});
//    }
//
//    @PostMapping("/signin")
//    public ResponseEntity<?> signin(@RequestBody Map<String, String> credentials) {
//        User signedInUser = authService.signin(credentials.get("email"), credentials.get("password"));
//        return createResponse(true, null, "로그인 성공");
//    }
//
//    @PostMapping("/signout")
//    public ResponseEntity<?> signout() {
//        authService.signout();
//        return createResponse(true, null, "로그아웃 성공");
//    }
//
//    private ResponseEntity<?> createResponse(boolean success, Object data, String message) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("success", success);
//        response.put("data", data);
//        response.put("message", message);
//        return ResponseEntity.ok(response);
//    }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDto userDto) {
        UserDto signedUpUser = authService.signup(userDto);
        return ResponseEntity.ok(new ApiResponse<>(true, signedUpUser, "회원 가입 성공"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> credentials) {
        User signedInUser = authService.signin(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(new ApiResponse<>(true, signedInUser, "로그인 성공"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> signout() {
        authService.signout();
        return ResponseEntity.ok(new ApiResponse<>(true, null, "로그아웃 성공"));
    }
}
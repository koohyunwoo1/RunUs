package runus.runus.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import runus.runus.api.ApiResponse;
import runus.runus.auth.service.AuthService;
import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @Autowired
    private AuthService authService;

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
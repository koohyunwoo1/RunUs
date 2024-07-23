package com.example.runus.user.controller;

import com.example.runus.user.dto.UserDto;
import com.example.runus.user.entity.User;
import com.example.runus.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return createResponse(true, data, "성공");
    }

    private ResponseEntity<?> createResponse(boolean success, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("data", data);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
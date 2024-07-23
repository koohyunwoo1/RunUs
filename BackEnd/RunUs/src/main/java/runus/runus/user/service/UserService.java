package com.example.runus.user.service;

import com.example.runus.user.dto.UserDto;
import com.example.runus.user.entity.User;

public interface UserService {
    UserDto updateUser(UserDto userDto);
    String searchEmail(String phoneNumber);
    String searchPassword(String email, String phoneNumber);
}

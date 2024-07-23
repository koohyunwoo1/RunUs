package com.example.runus.auth.service;

import com.example.runus.user.dto.UserDto;
import com.example.runus.user.entity.User;

public interface AuthService {
    //    User signup(User user);
    UserDto signup(UserDto userDto);

    User signin(String email, String password);

    void signout();
}
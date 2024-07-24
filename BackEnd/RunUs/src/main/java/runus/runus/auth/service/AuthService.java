package runus.runus.auth.service;

import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;

public interface AuthService {
    //    User signup(User user);
    UserDto signup(UserDto userDto);

    User signin(String email, String password);

    void signout();
}
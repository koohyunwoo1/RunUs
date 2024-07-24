package runus.runus.user.service;

import runus.runus.user.dto.UserDto;

public interface UserService {
    UserDto updateUser(UserDto userDto);
    String searchEmail(String phoneNumber);
    String searchPassword(String email, String phoneNumber);
}

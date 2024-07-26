package runus.runus.user.service;

import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;

import java.util.Optional;

public interface UserService {
    UserDto updateUser(UserDto userDto);
    String searchEmail(String phoneNumber);
    String searchPassword(String email, String phoneNumber);

    Optional<User> getUserById(Integer userId);
    UserDto getUserProfile(Integer userId); // 회원 정보 조회 메서드 추가
}

package runus.runus.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;
import runus.runus.user.repository.UserRepository;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        User existingUser = userRepository.findById(userDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // UserDto의 데이터로 existingUser 업데이트
        existingUser.setNickname(userDto.getNickname());
        existingUser.setPhoneNumber(userDto.getPhoneNumber());
        existingUser.setWeight(userDto.getWeight());
        existingUser.setRegionId(userDto.getRegionId());
        // 다른 필드들도 필요에 따라 업데이트

        System.out.println("userServiceImpl"+userDto);

        User updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }

    @Override
    public String searchEmail(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .map(User::getEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public String searchPassword(String email, String phoneNumber) {
        return userRepository.findByEmailAndPhoneNumber(email, phoneNumber)
                .map(User::getPassword)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();

        dto.setNickname(user.getNickname());
        dto.setEmail(user.getEmail());
        dto.setEmailDomain(user.getEmail()); //
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setWeight(user.getWeight());
        dto.setRegionId(user.getRegionId());
        dto.setProfileUrl(user.getProfileUrl());
        dto.setPassword(user.getPassword());
        return dto;
    }
}
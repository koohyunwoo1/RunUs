package runus.runus.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import runus.runus.api.NotFoundException;
import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;
import runus.runus.user.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserEntityById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("계정 정보가 없습니다."));
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        User existingUser = getUserEntityById(userDto.getUserId());

        // UserDto의 데이터로 existingUser 업데이트 (null 체크 포함)
        if (userDto.getNickname() != null) {
            existingUser.setNickname(userDto.getNickname());
        }
        if (userDto.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(userDto.getPhoneNumber());
        }
        if (userDto.getWeight() != null) {
            existingUser.setWeight(userDto.getWeight());
        }
        if (userDto.getRegionId() != null) {
            existingUser.setRegionId(userDto.getRegionId());
        }
        // 다른 필드들도 필요에 따라 업데이트

        System.out.println("userServiceImpl"+userDto);

        User updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }

    @Override
    public String searchEmail(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .map(User::getEmail)
                .orElseThrow(() -> new NotFoundException("계정 정보가 없습니다."));
    }

    @Override
    public String searchPassword(String email, String phoneNumber) {
        return userRepository.findByEmailAndPhoneNumber(email, phoneNumber)
                .map(User::getPassword)
                .orElseThrow(() -> new NotFoundException("계정 정보가 없습니다."));
    }

    @Override
    public UserDto getUserProfile(Integer userId) {
        User user = getUserEntityById(userId);
        return convertToDto(user);
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String storeProfilePicture(Integer userId, MultipartFile file) {
        User user = getUserEntityById(userId);

        // 파일 저장 경로 및 이름 생성
        String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + "/profile-pictures/" + filename);

        try {
            // 디렉토리 생성
            Files.createDirectories(path.getParent());
            // 파일 저장
            Files.write(path, file.getBytes());

            // 프로필 URL 업데이트
            String fileUrl = "/uploads/profile-pictures/" + filename;
            user.setProfileUrl(fileUrl);
            // 데이터베이스 업데이트
            User updatedUser = userRepository.save(user);

            // 로그로 업데이트된 사용자 정보 확인
            System.out.println("Updated user: " + updatedUser);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setNickname(user.getNickname());
        dto.setEmail(user.getEmail());
        dto.setEmailDomain(user.getEmailDomain());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setWeight(user.getWeight());
        dto.setRegionId(user.getRegionId());
        dto.setTierId(user.getTierId());
        dto.setIsDeleted(user.getIsDeleted());
        dto.setExp(user.getExp());
        dto.setRegisteredAt(user.getRegisteredAt());
        dto.setWithdrawalAt(user.getWithdrawalAt());
        dto.setProfileUrl(user.getProfileUrl());
        return dto;
    }

}
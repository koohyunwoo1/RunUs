package runus.runus.record.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.record.model.User;
import runus.runus.record.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 이메일로 사용자 조회
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    // ID로 사용자 조회
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    // ID로 사용자 삭제
    public void deleteUserById(Integer userId) {
        userRepository.deleteById(userId);
    }
}

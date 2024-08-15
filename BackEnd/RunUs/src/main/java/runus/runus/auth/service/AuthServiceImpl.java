package runus.runus.auth.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.api.DuplicateException;
import runus.runus.api.InvalidDataException;
import runus.runus.api.NotFoundElementException;
import runus.runus.user.dto.UserDto;
import runus.runus.user.entity.User;
import runus.runus.user.repository.UserRepository;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HttpSession httpSession;

    @Override
    public UserDto signup(UserDto userDto) {
        // DTO 필드 null 체크
        if (userDto.getEmail() == null) {
            throw new InvalidDataException("이메일은 필수 입력 항목입니다.");
        }
        if (userDto.getNickname() == null) {
            throw new InvalidDataException("닉네임은 필수 입력 항목입니다.");
        }
        if (userDto.getPassword() == null) {
            throw new InvalidDataException("비밀번호는 필수 입력 항목입니다.");
        }
        if (userDto.getPhoneNumber() == null) {
            throw new InvalidDataException("전화번호는 필수 입력 항목입니다.");
        }
        if (userDto.getWeight() == null) {
            throw new InvalidDataException("체중은 필수 입력 항목입니다.");
        }
        if (userDto.getRegionId() == null) {
            throw new InvalidDataException("지역 ID는 필수 입력 항목입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new DuplicateException("이미 존재하는 이메일입니다.");
        }

        User user = new User();
        user.setNickname(userDto.getNickname());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword()); // 실제로는 비밀번호를 암호화해야 합니다
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setWeight(userDto.getWeight());
        user.setRegionId(userDto.getRegionId());
        user.setRegisteredAt(LocalDateTime.now());
        user.setExp(0);
        user.setTierId(1);

        System.out.println("AuthServiceImpl"+user);
        System.out.println("회원가입 성공");

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public User signin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundElementException("계정 정보가 없습니다."));

        if (password.equals(user.getPassword())) {
            httpSession.setAttribute("user", user);
            System.out.println("로그인 성공");
            return user;
        } else {
            throw new InvalidDataException("패스워드가 일치하지 않습니다.");
        }
    }

    @Override
    public void signout() {
        httpSession.invalidate();
        System.out.println("로그아웃 성공");
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
       // dto.setUserId(user.getUserId());
        dto.setNickname(user.getNickname());
        dto.setEmail(user.getEmail());
        dto.setEmailDomain(user.getEmailDomain()); //
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setWeight(user.getWeight());
        dto.setRegionId(user.getRegionId());
        // 비밀번호는 보안상 DTO에 포함시키지 않습니다
        return dto;
    }
}
package runus.runus.record.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.record.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    // 예를 들어, 이메일로 사용자 조회
    Optional<User> findByEmail(String email);

}

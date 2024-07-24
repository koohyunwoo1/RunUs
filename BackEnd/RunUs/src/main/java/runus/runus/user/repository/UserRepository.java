package runus.runus.user.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.user.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByEmailAndPhoneNumber(String email, String phoneNumber);
}
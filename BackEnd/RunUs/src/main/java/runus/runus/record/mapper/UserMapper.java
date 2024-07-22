package runus.runus.record.mapper;

import runus.runus.record.dto.UserDTO;
import runus.runus.record.model.User;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class UserMapper {

    // DTO to Entity
    public static User toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        User user = new User();
        user.setUser_id(userDTO.getUser_id());
        user.setNickname(userDTO.getNickname());
        user.setEmail(userDTO.getEmail());
        user.setEmail_domain(userDTO.getEmail_domain());
        user.setPassword(userDTO.getPassword());
        user.setPhone_number(userDTO.getPhone_number());
        user.setWeight(userDTO.getWeight());
        user.setRegion_id(userDTO.getRegion_id());
        user.setTier_id(userDTO.getTier_id());
        user.setIs_deleted(userDTO.getIs_deleted());
        user.setExp(userDTO.getExp());

        if (userDTO.getRegistered_at() != null) {
            user.setRegistered_at(Timestamp.valueOf(userDTO.getRegistered_at()));
        }

        if (userDTO.getWithdrawal_at() != null) {
            user.setWithdrawal_at(Timestamp.valueOf(userDTO.getWithdrawal_at()));
        }

        user.setProfile_url(userDTO.getProfile_url());

        return user;
    }

    // Entity to DTO
    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setUser_id(user.getUser_id());
        userDTO.setNickname(user.getNickname());
        userDTO.setEmail(user.getEmail());
        userDTO.setEmail_domain(user.getEmail_domain());
        userDTO.setPassword(user.getPassword());
        userDTO.setPhone_number(user.getPhone_number());
        userDTO.setWeight(user.getWeight());
        userDTO.setRegion_id(user.getRegion_id());
        userDTO.setTier_id(user.getTier_id());
        userDTO.setIs_deleted(user.getIs_deleted());
        userDTO.setExp(user.getExp());

        if (user.getRegistered_at() != null) {
            userDTO.setRegistered_at(user.getRegistered_at().toString());
        }

        if (user.getWithdrawal_at() != null) {
            userDTO.setWithdrawal_at(user.getWithdrawal_at().toString());
        }

        userDTO.setProfile_url(user.getProfile_url());

        return userDTO;
    }
}

package runus.runus.user.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserDto {
    private Long userId;
    private String nickname;
    private String email;
    private String emailDomain; //
    private String password;
    private String phoneNumber;
    private Integer weight;
    private Integer regionId;
    private Integer tierId;
    private Character isDeleted;
    private Integer exp;
    private LocalDateTime registeredAt;
    private LocalDateTime withdrawalAt;
    private String profileUrl;

}
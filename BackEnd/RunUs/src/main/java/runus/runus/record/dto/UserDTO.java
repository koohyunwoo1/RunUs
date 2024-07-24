package runus.runus.record.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private int user_id;
    private String nickname;
    private String email;
    private String email_domain;
    private String password;
    private String phone_number;
    private int weight;
    private int region_id;
    private int tier_id;
    private String is_deleted;
    private Integer exp;
    private String registered_at;
    private String withdrawal_at;
    private String profile_url;
}

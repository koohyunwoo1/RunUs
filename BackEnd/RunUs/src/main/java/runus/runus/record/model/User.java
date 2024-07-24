package runus.runus.record.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int user_id;

    @Column(name = "nickname", nullable = false, length = 36)
    private String nickname;

    @Column(name = "email", nullable = false, length = 20)
    private String email;

    @Column(name = "email_domain", nullable = false, length = 200)
    private String email_domain;

    @Column(name = "password", nullable = false, length = 254)
    private String password;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phone_number;

    @Column(name = "weight", nullable = false)
    private int weight;

    @Column(name = "region_id", nullable = false)
    private int region_id;

    @Column(name = "tier_id", nullable = false)
    private int tier_id;

    @Column(name = "is_deleted", nullable = true, length = 1, columnDefinition = "char(1) default '0'")
    private String is_deleted;

    @Column(name = "exp", nullable = true, columnDefinition = "int default 0")
    private Integer exp;

    @Column(name = "registered_at", nullable = true, columnDefinition = "timestamp default current_timestamp")
    private Timestamp registered_at;

    @Column(name = "withdrawal_at", nullable = true)
    private Timestamp withdrawal_at;

    @Column(name = "profile_url", nullable = true, length = 254)
    private String profile_url;
}

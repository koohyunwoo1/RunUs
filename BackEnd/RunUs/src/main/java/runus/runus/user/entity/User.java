package com.example.runus.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String nickname;
    private String email;
    private String emailDomain;
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

    @Override
    public String toString() {
        return "User{" +
                ", nickname='" + nickname + '\'' +
                ", email='" + email + '\'' +
                ", emailDomain='" + emailDomain + '\'' +
                ", password='" + password + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", weight=" + weight +
                ", regionId=" + regionId +
                ", tierId=" + tierId +
                ", isDeleted=" + isDeleted +
                ", exp=" + exp +
                ", registeredAt=" + registeredAt +
                ", withdrawalAt=" + withdrawalAt +
                ", profileUrl='" + profileUrl + '\'' +
                '}';
    }
}
package com.example.runus.user.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
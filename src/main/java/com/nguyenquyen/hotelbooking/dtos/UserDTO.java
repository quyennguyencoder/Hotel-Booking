package com.nguyenquyen.hotelbooking.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.nguyenquyen.hotelbooking.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private Long id;

    private String email;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;

    private String phoneNumber;

    private UserRole role; //e.g CUSTOMER, ADMIN

    private Boolean isActive;
    private LocalDateTime createdAt;
}

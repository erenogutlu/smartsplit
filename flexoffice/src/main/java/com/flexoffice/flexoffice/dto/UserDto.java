package com.flexoffice.flexoffice.dto;

import lombok.Data;
import com.flexoffice.flexoffice.entity.Role;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}

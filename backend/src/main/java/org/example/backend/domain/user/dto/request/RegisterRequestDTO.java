package org.example.backend.domain.user.dto.request;

import lombok.Data;
import org.example.backend.domain.user.entity.Role;

@Data
public class RegisterRequestDTO {

    private String email;
    private String password;
    private String name;
    private String organization;
    private Role role;
    private String phone_number;

}

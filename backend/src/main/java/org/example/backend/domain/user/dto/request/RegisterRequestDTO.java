package org.example.backend.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.backend.domain.user.entity.Role;

@Data
public class RegisterRequestDTO {

    @NotEmpty(message = "email is required")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotEmpty(message = "password is required")
    private String password;

    @NotEmpty(message = "name is required")
    private String name;
    private String organization;

    @NotNull(message = "role is required")
    private Role role;

    @NotEmpty(message = "phone number is required")
    private String phone_number;

}

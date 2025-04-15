package org.example.backend.domain.accountLocal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailRequestDTO {
    @NotEmpty(message = "Class name is required")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;
}

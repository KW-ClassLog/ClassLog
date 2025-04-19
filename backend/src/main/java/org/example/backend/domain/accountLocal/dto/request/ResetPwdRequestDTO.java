package org.example.backend.domain.accountLocal.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPwdRequestDTO {

    @NotEmpty(message = "Password is required")
    private String password;

    @NotEmpty(message = "New Password is required")
    private String newPassword;
}

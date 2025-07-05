package org.example.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WithdrawRequestDTO {
    @NotEmpty(message = "passwordConfirm is required")
    private String passwordConfirm;
}
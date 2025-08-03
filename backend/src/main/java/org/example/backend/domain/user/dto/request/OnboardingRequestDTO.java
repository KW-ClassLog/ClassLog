package org.example.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.example.backend.domain.user.entity.Role;

@Getter
@Builder
@AllArgsConstructor
public class OnboardingRequestDTO {

    private String organization;

    @NotNull(message = "role is required")
    private Role role;

    @NotEmpty(message = "phone number is required")
    private String phoneNumber;
}

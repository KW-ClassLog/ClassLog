package org.example.backend.domain.studentClass.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class StudentEnrolledResponseDTO {
    UUID userId;
    String name;
    String nickname;
    String phoneNumber;
    String profileUrl;
    String organization;
}

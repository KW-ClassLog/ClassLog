package org.example.backend.domain.classroom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class EntryCodeVerifyResponseDTO {
    private UUID classId;
}
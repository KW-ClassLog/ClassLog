package org.example.backend.domain.classroom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class EntryCodeResponseDTO {
    private UUID classId;
    private String entryCode;
    private String expiresAt;
}
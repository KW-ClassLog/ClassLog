package org.example.backend.domain.lectureNote.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureNoteResponseDTO {

    private UUID lectureId;        // LectureNote ID
    private UUID classId;           // Class ID (Classroom ID)
    private String lectureNoteUrl;  // 저장된 S3 URL
}
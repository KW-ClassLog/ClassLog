package org.example.backend.domain.lecture.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class LectureRecordingResponseDTO {
    private UUID lectureId;
    private String audioName;
    private String audioUrl;
    private String fileSize;
}
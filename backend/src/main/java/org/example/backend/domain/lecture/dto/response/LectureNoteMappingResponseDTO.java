package org.example.backend.domain.lecture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class LectureNoteMappingResponseDTO {
    private List<UUID> lectureNoteIds;
}
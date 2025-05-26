package org.example.backend.domain.lecture.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
public class LectureNoteMappingRequestDTO {
    private List<UUID> lectureNoteIds;
}

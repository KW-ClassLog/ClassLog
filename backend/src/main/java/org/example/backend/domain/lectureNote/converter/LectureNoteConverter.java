package org.example.backend.domain.lectureNote.converter;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;

import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class LectureNoteConverter {

    public static LectureNoteResponseDTO toDTO(LectureNote lectureNote) {
        return LectureNoteResponseDTO.builder()
                .lectureId(lectureNote.getId())
                .classId(lectureNote.getClassroom().getId())
                .lectureNoteUrl(lectureNote.getNoteUrl())
                .build();
    }
}
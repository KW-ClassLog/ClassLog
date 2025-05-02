package org.example.backend.domain.lectureNote.converter;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;

import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class LectureNoteConverter {

    public static LectureNoteKeyResponseDTO toDTO(LectureNote lectureNote) {
        return LectureNoteKeyResponseDTO.builder()
                .lectureNoteId(lectureNote.getId())
                .classId(lectureNote.getClassroom().getId())
                .lectureNoteKey(lectureNote.getNoteUrl()) // S3 Key 또는 URL
                .build();
    }
    public static List<LectureNoteKeyResponseDTO> toDTOList(List<LectureNote> lectureNotes) {
        return lectureNotes.stream()
                .map(LectureNoteConverter::toDTO)
                .collect(Collectors.toList());
    }
}
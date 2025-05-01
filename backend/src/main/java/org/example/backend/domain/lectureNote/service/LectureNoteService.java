package org.example.backend.domain.lectureNote.service;

import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface LectureNoteService {
    LectureNote uploadLectureNote(UUID classId, MultipartFile file) throws IOException;
    void deleteLectureNote(UUID lectureNoteId);
    LectureNoteResponseDTO getLectureNoteDetail(UUID lectureNoteId);

    List<LectureNoteKeyResponseDTO> getLectureNoteList(UUID lectureId);
}

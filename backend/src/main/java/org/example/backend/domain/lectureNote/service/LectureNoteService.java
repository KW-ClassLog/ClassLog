package org.example.backend.domain.lectureNote.service;

import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface LectureNoteService {
    void deleteLectureNote(List<UUID> lectureNoteIds);
    LectureNoteResponseDTO getLectureNoteDetail(UUID lectureNoteId);
    List<LectureNote> uploadLectureNotes(UUID classId, List<MultipartFile> files) throws IOException;
    List<LectureNoteKeyResponseDTO> getLectureNoteList(UUID lectureId);
    List<LectureNoteResponseDTO> getLectureNoteListByLecture(UUID lectureId);
}

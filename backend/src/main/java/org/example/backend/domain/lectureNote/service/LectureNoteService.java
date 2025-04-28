package org.example.backend.domain.lectureNote.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureNoteService {

    private final S3Service s3Service;
    private final LectureNoteRepository lectureNoteRepository;
    private final ClassroomRepository classroomRepository; // ✅ 추가

    public LectureNote uploadLectureNote(UUID classId, MultipartFile file) throws IOException {
        // 1. S3에 업로드
        String key = "lecture_note/" + classId + "/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
        String fileUrl = s3Service.uploadFile(file, key);

        // 2. classId로 Classroom 엔티티 조회
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("해당 classId의 Classroom이 존재하지 않습니다."));

        // 3. LectureNote 저장
        LectureNote lectureNote = LectureNote.builder()
                .noteUrl(fileUrl)
                .classroom(classroom) // ✅ 객체 넣기
                .build();

        return lectureNoteRepository.save(lectureNote);

    }
}
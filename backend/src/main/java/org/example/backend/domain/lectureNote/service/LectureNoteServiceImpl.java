package org.example.backend.domain.lectureNote.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.exception.LectureNoteErrorCode;
import org.example.backend.domain.lectureNote.exception.LectureNoteException;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureNoteServiceImpl implements LectureNoteService{

    private final S3Service s3Service;
    private final LectureNoteRepository lectureNoteRepository;
    private final ClassroomRepository classroomRepository; // ✅ 추가

    //파일 업로드
    public LectureNote uploadLectureNote(UUID classId, MultipartFile file) throws IOException {
        // 1. S3에 업로드
        String key = "lecture_note/" + classId + "/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
        String fileUrl = s3Service.uploadFile(file, key);

        // 2. classId로 Classroom 엔티티 조회
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        // 3. LectureNote 저장
        LectureNote lectureNote = LectureNote.builder()
                .noteUrl(key)
                .classroom(classroom) // ✅ 객체 넣기
                .build();

        return lectureNoteRepository.save(lectureNote);

    }

    //파일 삭제
    public void deleteLectureNote(UUID lectureNoteId) {
        // 1. DB에서 LectureNote 조회
        LectureNote lectureNote = lectureNoteRepository.findById(lectureNoteId)
                .orElseThrow(() -> new LectureNoteException(LectureNoteErrorCode.LECTURE_NOTE_NOT_FOUND));

        // 2. S3에 저장된 파일 삭제 (key는 noteUrl로 저장돼 있다고 가정)
        String s3Key = lectureNote.getNoteUrl(); // noteUrl 필드에 key가 저장돼 있어야 함
        s3Service.deleteFile(s3Key);

        // 3. LectureNote 삭제
        lectureNoteRepository.deleteById(lectureNoteId);
    }

    //파일 개별 조회
    public LectureNoteResponseDTO getLectureNoteDetail(UUID lectureNoteId) {
        LectureNote lectureNote = lectureNoteRepository.findById(lectureNoteId)
                .orElseThrow(() -> new LectureNoteException(LectureNoteErrorCode.LECTURE_NOTE_NOT_FOUND));

        // 1. DB에 저장된 S3 key 가져오기
        String s3Key = lectureNote.getNoteUrl();

        // 2. 해당 key로 presigned URL 생성
        String presignedUrl = s3Service.getPresignedUrl(s3Key);

        // 3. DTO에 담아 응답
        return LectureNoteResponseDTO.builder()
                .lectureNoteId(lectureNote.getId())
                .classId(lectureNote.getClassroom().getId())
                .lectureNoteUrl(presignedUrl)
                .build();
    }

    //클래스 별 강의록 목록 조회
    @Override
    public List<LectureNoteKeyResponseDTO> getLectureNoteList(UUID classId) {
        List<LectureNote> notes = lectureNoteRepository.findByClassroom_Id(classId);

        return notes.stream()
                .map(note -> LectureNoteKeyResponseDTO.builder()
                        .lectureNoteId(note.getId())
                        .lectureNoteKey(note.getNoteUrl())
                        .classId(note.getClassroom().getId())
                        .build())
                .toList();
    }

    //

}
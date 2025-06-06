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
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureNoteServiceImpl implements LectureNoteService {

    private final S3Service s3Service;
    private final LectureNoteRepository lectureNoteRepository;
    private final ClassroomRepository classroomRepository; // ✅ 추가
    private final LectureNoteMappingRepository lectureNoteMappingRepository;

    public List<LectureNote> uploadLectureNotes(UUID classId, List<MultipartFile> files) throws IOException {
        // 1. 여러 파일에 대해 처리
        List<LectureNote> lectureNotes = new ArrayList<>();

        // 2. 각 파일 업로드 처리
        for (MultipartFile file : files) {
            // 1) S3에 업로드
            String key = "lecture_note/" + classId + "/" + UUID.randomUUID() + "/" + file.getOriginalFilename();
            String fileUrl = s3Service.uploadFile(file, key);

            // 2) classId로 Classroom 엔티티 조회
            Classroom classroom = classroomRepository.findById(classId)
                    .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

            // 3) LectureNote 객체 생성
            LectureNote lectureNote = LectureNote.builder()
                    .noteUrl(key)
                    .classroom(classroom) // Classroom 객체 넣기
                    .build();

            // 4) LectureNote 저장
            lectureNotes.add(lectureNoteRepository.save(lectureNote));
        }

        return lectureNotes;
    }

    //파일 삭제
    public void deleteLectureNote(List<UUID> lectureNoteIds) {

        for (UUID lectureNoteId : lectureNoteIds) {

        LectureNote lectureNote = lectureNoteRepository.findById(lectureNoteId)
                .orElseThrow(() -> new LectureNoteException(LectureNoteErrorCode.LECTURE_NOTE_NOT_FOUND));

        String s3Key = lectureNote.getNoteUrl();
        s3Service.deleteFile(s3Key);

        lectureNoteRepository.deleteById(lectureNoteId);

        }
    }

    //파일 개별 조회
    public LectureNoteResponseDTO getLectureNoteDetail(UUID lectureNoteId) {
        LectureNote lectureNote = lectureNoteRepository.findById(lectureNoteId)
                .orElseThrow(() -> new LectureNoteException(LectureNoteErrorCode.LECTURE_NOTE_NOT_FOUND));

        // 1. DB에 저장된 S3 key 가져오기
        String s3Key = lectureNote.getNoteUrl();

        // 2. 해당 key로 presigned URL 생성
        String presignedUrl = s3Service.getPresignedUrl(s3Key);
        String fileSize = s3Service.getFileSize(s3Key);

        // 3. DTO에 담아 응답
        return LectureNoteResponseDTO.builder()
                .lectureNoteId(lectureNote.getId())
                .classId(lectureNote.getClassroom().getId())
                .lectureNoteUrl(presignedUrl)
                .fileSize(fileSize)
                .build();
    }

    //클래스 별 강의록 목록 조회
    @Override
    public List<LectureNoteKeyResponseDTO> getLectureNoteList(UUID classId) {
        List<LectureNote> notes = lectureNoteRepository.findByClassroom_Id(classId);



        return notes.stream()
                .map(note -> {
                    String s3Key = note.getNoteUrl();
                    String presignedUrl = s3Service.getPresignedUrl(s3Key);
                    String fileSize = s3Service.getFileSize(s3Key);
                    String lectureNoteName = s3Key.substring(s3Key.lastIndexOf('/') + 1);
                    List<LectureNoteMapping> mappings = lectureNoteMappingRepository.findByLectureNote_Id(note.getId());


                    List<Integer> sessionList = mappings.stream()
                            .map(mapping -> mapping.getLecture().getSession())
                            .filter(Objects::nonNull)
                            .sorted()
                            .toList();

                    return LectureNoteKeyResponseDTO.builder()
                            .lectureNoteId(note.getId())
                            .classId(note.getClassroom().getId())
                            .lectureNoteUrl(presignedUrl)
                            .fileSize(fileSize)
                            .lectureNoteName(lectureNoteName)
                            .session(sessionList)
                            .build();
                })
                .toList();
    }

    //강의 별 강의록 목록 조회
    @Override
    public List<LectureNoteResponseDTO> getLectureNoteListByLecture(UUID lectureId) {
        List<LectureNoteMapping> mappings = lectureNoteMappingRepository.findAllByLectureId(lectureId);

        return mappings.stream()
                .map(mapping -> {
                    LectureNote lectureNote = mapping.getLectureNote();
                    String s3Key = lectureNote.getNoteUrl();
                    String presignedUrl = s3Service.getPresignedUrl(s3Key);


                    String fileSize = s3Service.getFileSize(s3Key);
                    String lectureNoteName = s3Key.substring(s3Key.lastIndexOf('/') + 1);


                    return LectureNoteResponseDTO.builder()
                            .lectureNoteId(lectureNote.getId())
                            .lectureNoteUrl(presignedUrl)
                            .classId(lectureNote.getClassroom().getId())
                            .lectureNoteName(lectureNoteName)
                            .fileSize(fileSize)
                            .build();
                })
                .toList();

    }

}
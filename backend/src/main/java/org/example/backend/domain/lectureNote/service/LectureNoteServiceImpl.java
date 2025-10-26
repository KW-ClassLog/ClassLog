package org.example.backend.domain.lectureNote.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lectureNote.converter.FileToMultipartFileConverter;
import org.example.backend.domain.lectureNote.converter.LibreOfficeConverter;
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

import java.io.File;
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
    private final ClassroomRepository classroomRepository;
    private final LectureNoteMappingRepository lectureNoteMappingRepository;
    private final LibreOfficeConverter libreOfficeConverter;

    public List<LectureNote> uploadLectureNotes(UUID classId, List<MultipartFile> files) throws IOException {
        List<LectureNote> lectureNotes = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "파일명이 필요합니다");
            boolean isPptx = originalFilename.toLowerCase().endsWith(".pptx");

            File tempSrc = null;
            File convertedPdf = null;
            String uploadFileName;
            String key;
            MultipartFile pdfMultipart;

            try {
                if (isPptx) {
                    // MultipartFile -> File
                    tempSrc = new File(System.getProperty("java.io.tmpdir"), originalFilename);
                    file.transferTo(tempSrc);

                    try {
                        // PPTX → PDF 변환
                        convertedPdf = libreOfficeConverter.convertPptxToPdf(tempSrc);

                        // File -> MultipartFile
                        pdfMultipart = new FileToMultipartFileConverter(convertedPdf, "application/pdf");
                    } catch (Exception e) {
                        throw new IOException("PPTX→PDF 변환 실패: " + originalFilename, e);
                    }

                    uploadFileName = convertedPdf.getName();

                    // S3 업로드
                    key = "lecture_note/" + classId + "/" + UUID.randomUUID() + "/" + uploadFileName;
                    s3Service.uploadFile(pdfMultipart, key);

                } else {
                    // pptx 외 다른 파일들 그대로 업로드
                    uploadFileName = originalFilename;
                    key = "lecture_note/" + classId + "/" + UUID.randomUUID() + "/" + uploadFileName;
                    s3Service.uploadFile(file, key);
                }

                Classroom classroom = classroomRepository.findById(classId)
                        .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

                LectureNote lectureNote = LectureNote.builder()
                        .noteUrl(key)
                        .classroom(classroom)
                        .build();

                lectureNotes.add(lectureNoteRepository.save(lectureNote));

            } finally {
                // pdf로 변환하며 생긴 임시 파일 삭제
                if (tempSrc != null && tempSrc.exists()) tempSrc.delete();
                if (convertedPdf != null && convertedPdf.exists()) convertedPdf.delete();
            }
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
                            .distinct()
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
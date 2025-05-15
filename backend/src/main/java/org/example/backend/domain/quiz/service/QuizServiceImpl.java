package org.example.backend.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.infra.langchain.LangChainClient;
import org.example.backend.global.S3.service.S3Service;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final LectureRepository lectureRepository;
    private final LectureNoteMappingRepository lectureNoteMappingRepository;
    private final LectureNoteRepository lectureNoteRepository;
    private final LangChainClient langChainClient;
    private final S3Service s3Service;

    @Override
    public QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        Object principal = authentication.getPrincipal();
//
//        Role role =  ((CustomUserDetails) principal).getUser().getRole();
//
//        if (role == Role.STUDENT) {
//            throw new QuizException(QuizErrorCode.STUDENT_NOT_CREATE_QUIZ);
//        }

        // 강의 존재 여부 확인
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        // 강의록 매핑 존재 여부 확인
        List<LectureNoteMapping> mappings = lectureNoteMappingRepository.findAllByLectureId(lectureId);
        if (mappings.isEmpty()) {
            throw new QuizException(QuizErrorCode.LECTURE_NOTE_NOT_FOUND);
        }

        // 모든 강의록을 조회
        List<LectureNote> notes = mappings.stream()
                .map(mapping -> {
                    LectureNote note = lectureNoteRepository.findById(mapping.getLectureNoteId())
                            .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOTE_NOT_FOUND));
                    return note;
                })
                .collect(Collectors.toList());

        // S3 URL 변환
        String noteUrls = notes.stream()
                .map(note -> {
                    String presignedUrl = s3Service.getPresignedUrl(note.getNoteUrl());
                    return presignedUrl;
                })
                .collect(Collectors.joining(","));

        String audioUrl = s3Service.getPresignedUrl(lecture.getAudioUrl());

        try {
            return langChainClient.requestQuiz(
                    lectureId.toString(),
                    noteUrls,
                    request.isUseAudio(),
                    audioUrl
            );
        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AI_CALL_FAILED);
        }
    }
}
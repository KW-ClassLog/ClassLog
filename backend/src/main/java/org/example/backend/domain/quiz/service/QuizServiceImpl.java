package org.example.backend.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.domain.notification.entity.AlarmType;
import org.example.backend.domain.notification.service.NotificationService;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.converter.QuizConverter;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.request.QuizSaveRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizListResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizSaveResponseDTO;
import org.example.backend.domain.option.dto.response.OptionResponseDTO;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.example.backend.infra.langchain.LangChainClient;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
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
    private final QuizRepository quizRepository;
    private final OptionRepository optionRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final CustomSecurityUtil customSecurityUtil;
    private final QuizConverter quizConverter;

    private final TaskScheduler taskScheduler;
    private final NotificationService notificationService;

    // 퀴즈 생성 및 재생성
    @Override
    public QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request, boolean isReGenerate) {
        Role role = customSecurityUtil.getUserRole();
        UUID userId = customSecurityUtil.getUserId();

        if (role == Role.STUDENT) {
            throw new QuizException(QuizErrorCode.STUDENT_NOT_CREATE_QUIZ);
        }

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        if (!lecture.getClassroom().getProfessor().getId().equals(userId)) {
            throw new QuizException(QuizErrorCode.UNAUTHORIZED_ACCESS);
        }

        List<LectureNoteMapping> mappings = lectureNoteMappingRepository.findAllByLectureId(lectureId);
        if (mappings.isEmpty()) {
            throw new QuizException(QuizErrorCode.LECTURE_NOTE_NOT_FOUND);
        }

        List<LectureNote> notes = mappings.stream()
                .map(mapping -> lectureNoteRepository.findById(mapping.getLectureNoteId())
                        .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOTE_NOT_FOUND)))
                .collect(Collectors.toList());

        String audioUrl = null;
        if (request.isUseAudio()) {
            if (lecture.getAudioUrl() == null) {
                throw new QuizException(QuizErrorCode.AUDIO_NOT_FOUND);
            }
            audioUrl = s3Service.getPresignedUrl(lecture.getAudioUrl());
        }

        List<String> allowedExtensions = Arrays.asList(".pdf", ".pptx", ".docx", ".hwp", ".hwpx");

        List<LectureNote> filteredNotes = notes.stream()
                .filter(note -> {
                    String url = note.getNoteUrl();
                    if (url == null) return false;
                    String lowerUrl = url.toLowerCase();
                    return allowedExtensions.stream().anyMatch(lowerUrl::endsWith);
                })
                .toList();

        if (filteredNotes.isEmpty()) {
            throw new QuizException(QuizErrorCode.UNSUPPORTED_NOTE_FORMAT);
        }

        String noteUrls = filteredNotes.stream()
                .map(note -> s3Service.getPresignedUrl(note.getNoteUrl()))
                .collect(Collectors.joining(","));

        try {
            if (isReGenerate) {
                return langChainClient.requestQuiz(lectureId.toString(), noteUrls, request.isUseAudio(), audioUrl, true);
            } else {
                return langChainClient.requestQuiz(lectureId.toString(), noteUrls, request.isUseAudio(), audioUrl, false);
            }
        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AI_CALL_FAILED);
        }
    }



    // 퀴즈 저장
    @Override
    public QuizSaveResponseDTO saveQuiz(UUID lectureId, QuizSaveRequestDTO request) {

        Role role = customSecurityUtil.getUserRole();
        UUID userId = customSecurityUtil.getUserId();


        if (role == Role.STUDENT) {
            throw new QuizException(QuizErrorCode.STUDENT_NOT_CREATE_QUIZ);
        }

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        if (!lecture.getClassroom().getProfessor().getId().equals(userId)) {
            throw new QuizException(QuizErrorCode.UNAUTHORIZED_ACCESS);
        }

        List<UUID> savedQuizIds = new ArrayList<>();


        for (QuizSaveRequestDTO.QuizDTO dto : request.getQuizzes()) {
            QuizType quizType;
            try {
                quizType = QuizType.from(dto.getType());
            } catch (IllegalArgumentException e) {
                throw new QuizException(QuizErrorCode.INVALID_QUIZ_TYPE);
            }

            Quiz quiz = Quiz.builder()
                    .lecture(lecture)
                    .quizOrder(dto.getQuizOrder())
                    .quiz(dto.getQuizBody())
                    .solution(dto.getSolution())
                    .type(quizType)
                    .build();

            quizRepository.save(quiz);
            savedQuizIds.add(quiz.getId());

            // 객관식이면 Option 저장
            if (quiz.getType() == QuizType.MULTIPLE_CHOICE) {
                List<String> options = dto.getOptions();
                for (int i = 0; i < options.size(); i++) {
                    Option option = Option.builder()
                            .quiz(quiz)
                            .text(options.get(i))
                            .optionOrder(i + 1)
                            .build();
                    optionRepository.save(option);
                }
            }
        }
        scheduleQuizAnswerUploadNotification(lecture);


        return QuizSaveResponseDTO.builder()
                .lectureId(lectureId)
                .savedCount(savedQuizIds.size())
                .quizIds(savedQuizIds)
                .build();
    }
    private void scheduleQuizAnswerUploadNotification(Lecture lecture) {
        // 현재 시간 기준으로 "오늘 밤 12시(자정)" 계산
        LocalDateTime midnight = LocalDate.now()
                .plusDays(1) // 내일 0시 (오늘 밤 12시)
                .atStartOfDay();

        ZoneId zone = ZoneId.systemDefault();
        Instant triggerTime = midnight.atZone(zone).toInstant();

        taskScheduler.schedule(() -> {
            notificationService.sendAlarmToProfessor(
                    lecture.getId(),
                    AlarmType.quizAnswerUpload,
                    "시스템",
                    lecture.getLectureName() + " 퀴즈 대시보드가 업로드 되었습니다."
            );
        }, triggerTime);
    }


    // 퀴즈 문제 조회
    @Override
    @Transactional(readOnly = true)
    public QuizListResponseDTO getQuizzes(UUID lectureId) {
        UUID userId = customSecurityUtil.getUserId();

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        List<Quiz> quizList = quizRepository.findByLectureId(lectureId);

        if (quizList.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_GENERATED_YET);
        }

        for (Quiz quiz : quizList) {
            if (quizAnswerRepository.existsByUserIdAndQuizId(userId, quiz.getId())) {
                throw new QuizException(QuizErrorCode.QUIZ_ALREADY_SUBMITTED);
            }
        }

        return quizConverter.toQuizListResponseDTO(lectureId, quizList);
    }
}
package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizAnswer.dto.response.QuizInfoResponseDTO;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizInfoServiceImpl implements QuizInfoService {

    private final LectureRepository lectureRepository;
    private final CustomSecurityUtil customSecurityUtil;


    // 퀴즈 정보 조회
    @Override
    public QuizInfoResponseDTO getQuizInfo(UUID lectureId) {

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

        String title = lecture.getLectureName();
        String quizDate = lecture.getLectureDate().toString();

        DayOfWeek dayOfWeek = lecture.getLectureDate().getDayOfWeek();
        String quizDay = dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.KOREAN);

        return QuizInfoResponseDTO.builder()
                .title(title)
                .quizDate(quizDate)
                .quizDay(quizDay)
                .build();
    }
}

package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizAnswer.dto.response.QuizInfoResponseDTO;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizInfoServiceImpl implements QuizInfoService {

    private final LectureRepository lectureRepository;

    // 퀴즈 정보 조회
    @Override
    public QuizInfoResponseDTO getQuizInfo(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

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

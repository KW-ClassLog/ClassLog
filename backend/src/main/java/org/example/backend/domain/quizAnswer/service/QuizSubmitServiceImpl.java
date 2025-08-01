package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.converter.QuizAnswerConverter;
import org.example.backend.domain.quizAnswer.dto.request.QuizSubmitRequestDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitResponseDTO;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizSubmitServiceImpl implements QuizSubmitService {

    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final UserRepository userRepository;
    private final CustomSecurityUtil customSecurityUtil;


    // 정답 확인 함수
    private boolean isCorrect(String submitted, String solution) {
        return normalize(submitted).equals(normalize(solution));
    }

    // 정답 텍스트 정규화
    private String normalize(String input) {
        if (input == null) return "";
        return input.replaceAll("\\s+", "")         // 공백 제거
                .replaceAll("[^ㄱ-ㅎ가-힣a-zA-Z0-9]", "") // 특수문자 제거
                .toLowerCase();                // 소문자 통일
    }


    // 퀴즈 제출 + 정답 확인
    @Transactional
    public QuizSubmitResponseDTO submitQuizAnswers(QuizSubmitRequestDTO request) {

        UUID userId = customSecurityUtil.getUserId();

        int savedCount = 0;

        for (QuizSubmitRequestDTO.AnswerDTO dto : request.getAnswers()) {
            Quiz quiz = quizRepository.findById(dto.getQuizId())
                    .orElseThrow(() -> new QuizException(QuizErrorCode.QUIZ_NOT_FOUND));


            boolean correct = isCorrect(dto.getAnswer(), quiz.getSolution());

            QuizAnswer quizAnswer = QuizAnswerConverter.toEntity(
                    userId,
                    quiz,
                    dto.getAnswer(),
                    correct,
                    userRepository
            );

            quizAnswerRepository.save(quizAnswer);
            savedCount++;
        }

        return QuizAnswerConverter.toSubmitResponse(userId, savedCount);
    }
}


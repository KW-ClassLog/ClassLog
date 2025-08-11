package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.option.dto.response.OptionResponseDTO;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.dto.response.QuizListResponseDTO;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.converter.QuizResultStudentConverter;
import org.example.backend.domain.quizAnswer.dto.response.QuizResultStudentResponseDTO;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizResultStudentServiceImpl implements QuizResultStudentService {

    private final CustomSecurityUtil customSecurityUtil;
    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final LectureRepository lectureRepository;
    private final OptionRepository optionRepository;

    // 학생 별 퀴즈 결과
    @Override
    @Transactional(readOnly = true)
    public QuizResultStudentResponseDTO getQuizResult(UUID lectureId) {

        Role role = customSecurityUtil.getUserRole();
        UUID userId = customSecurityUtil.getUserId();

        if (role == Role.TEACHER) {
            throw new QuizException(QuizErrorCode.UNAUTHORIZED_ACCESS);
        }

        lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        List<Quiz> quizzes = quizRepository.findByLectureId(lectureId);
        if (quizzes.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_GENERATED_YET);
        }

        boolean hasAnyAnswer = false;
        List<QuizResultStudentResponseDTO.QuizDTO> quizDTOs = new ArrayList<>();

        for (Quiz q : quizzes) {
            List<Option> options = (q.getType() == QuizType.MULTIPLE_CHOICE)
                    ? optionRepository.findByQuizId(q.getId())
                    : List.of();

            QuizAnswer myAnswer = quizAnswerRepository
                    .findByQuizIdAndUserId(q.getId(), userId)
                    .orElse(null);

            if (myAnswer != null) {
                hasAnyAnswer = true;
            }

            quizDTOs.add(QuizResultStudentConverter.toQuizDTO(q, options, myAnswer));
        }

        if (!hasAnyAnswer) {
            throw new QuizException(QuizErrorCode.QUIZ_ANSWER_NOT_FOUND);
        }
        return QuizResultStudentConverter.toResultStudentResponse(lectureId, quizDTOs);
    }
}

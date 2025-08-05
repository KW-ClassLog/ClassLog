package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.option.dto.response.OptionResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizListResponseDTO;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.dto.response.QuizResultStudentResponseDTO;
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

    // 학생 별 퀴즈 결과
    @Override
    @Transactional(readOnly = true)
    public QuizResultStudentResponseDTO getQuizResult(UUID lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        List<Quiz> quizList = quizRepository.findByLectureId(lectureId);

        if (role == Role.STUDENT) {
            throw new QuizException(QuizErrorCode.STUDENT_NOT_CREATE_QUIZ);
        }

        if (quizList.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_GENERATED_YET);
        }

        List<QuizListResponseDTO.QuizDTO> quizDTOs = quizList.stream().map(quiz -> {
            List<OptionResponseDTO> options = new ArrayList<>();
            if (quiz.getType() == QuizType.MULTIPLE_CHOICE) {
                options = optionRepository.findByQuizId(quiz.getId())
                        .stream()
                        .map(option -> new OptionResponseDTO(
                                option.getId(),
                                option.getOptionOrder(),
                                option.getText()
                        ))
                        .toList();
            }
            return new QuizListResponseDTO.QuizDTO(
                    quiz.getId(),
                    quiz.getQuizOrder(),
                    quiz.getQuiz(),
                    quiz.getSolution(),
                    quiz.getType().name(),
                    options
            );
        }).toList();

        return new QuizListResponseDTO(lectureId, quizDTOs);    }
}

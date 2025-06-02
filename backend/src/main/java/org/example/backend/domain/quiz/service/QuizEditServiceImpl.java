package org.example.backend.domain.quiz.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.dto.request.QuizEditRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizEditResponseDTO;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class QuizEditServiceImpl implements QuizEditService {

    private final QuizRepository quizRepository;
    private final LectureRepository lectureRepository;
    private final OptionRepository optionRepository;
    private final CustomSecurityUtil customSecurityUtil;

    @Transactional
    @Override
    public QuizEditResponseDTO editQuiz(UUID lectureId, QuizEditRequestDTO request) {
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

        List<UUID> updatedQuizIds = new ArrayList<>();

        for (QuizEditRequestDTO.QuizDTO dto : request.getQuizzes()) {
            Quiz quiz = quizRepository.findByLectureIdAndQuizOrder(lectureId, dto.getQuizOrder())
                    .orElseThrow(() -> new QuizException(QuizErrorCode.QUIZ_NOT_FOUND));

            QuizType oldType = quiz.getType();
            QuizType newType;

            try {
                newType = QuizType.from(dto.getType());
            } catch (IllegalArgumentException e) {
                throw new QuizException(QuizErrorCode.INVALID_QUIZ_TYPE);
            }

            quiz.update(dto.getQuizBody(), dto.getSolution(), newType);


            if (oldType != newType) {
                optionRepository.deleteByQuizId(quiz.getId());
            }

            if (newType == QuizType.MULTIPLE_CHOICE) {
                List<QuizEditRequestDTO.QuizDTO.OptionDTO> newOptions = dto.getOptions();

                for (QuizEditRequestDTO.QuizDTO.OptionDTO optDto : newOptions) {
                    Option option = Option.builder()
                            .quiz(quiz)
                            .optionOrder(optDto.getOptionOrder())
                            .text(optDto.getOption())
                            .build();
                    optionRepository.save(option);
                }
            }

            updatedQuizIds.add(quiz.getId());
        }

        return QuizEditResponseDTO.builder()
                .lectureId(lectureId)
                .savedCount(updatedQuizIds.size())
                .quizIds(updatedQuizIds)
                .build();
    }
}

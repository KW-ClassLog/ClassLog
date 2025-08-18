package org.example.backend.domain.quiz.converter;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.option.dto.response.OptionResponseDTO;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.dto.response.QuizListResponseDTO;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class QuizConverter {

    private final OptionRepository optionRepository;

    public QuizListResponseDTO toQuizListResponseDTO(UUID lectureId, List<Quiz> quizList) {
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

        return new QuizListResponseDTO(lectureId, quizDTOs);
    }
}
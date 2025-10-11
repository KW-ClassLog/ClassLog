package org.example.backend.domain.quizAnswer.converter;

import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quizAnswer.dto.response.QuizResultStudentResponseDTO;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Component
public class QuizResultStudentConverter {
    public static QuizResultStudentResponseDTO toResultStudentResponse(
            UUID lectureId,
            List<QuizResultStudentResponseDTO.QuizDTO> quizzes
    ) {
        List<QuizResultStudentResponseDTO.QuizDTO> sortedQuizzes = quizzes.stream()
                .sorted((q1, q2) -> Integer.compare(q1.getQuizOrder(), q2.getQuizOrder()))
                .collect(Collectors.toList());

        return QuizResultStudentResponseDTO.builder()
                .lectureId(lectureId)
                .quizzes(sortedQuizzes)
                .build();
    }

    public static QuizResultStudentResponseDTO.QuizDTO toQuizDTO(
            Quiz quiz,
            List<Option> options,
            QuizAnswer myAnswer // null 가능
    ) {
        String studentAnswer = (myAnswer != null) ? myAnswer.getAnswer() : null;
        boolean isCollect = (myAnswer != null) && Boolean.TRUE.equals(myAnswer.getIsCollect());

        List<QuizResultStudentResponseDTO.OptionDTO> optionDTOs = options.stream()
                .sorted((o1, o2) -> Integer.compare(o1.getOptionOrder(), o2.getOptionOrder()))
                .map(o -> QuizResultStudentResponseDTO.OptionDTO.builder()
                        .id(o.getId())
                        .optionOrder(o.getOptionOrder())
                        .text(o.getText())
                        .build())
                .collect(Collectors.toList());

        return QuizResultStudentResponseDTO.QuizDTO.builder()
                .quizId(quiz.getId())
                .quizOrder(quiz.getQuizOrder())
                .quizBody(quiz.getQuiz())
                .solution(quiz.getSolution())
                .type(toCamelCase(quiz.getType()))
                .studentAnswer(studentAnswer)
                .collect(isCollect)
                .options(optionDTOs)
                .build();
    }

    // MULTIPLE_CHOICE -> multipleChoice 변환
    public static String toCamelCase(Enum<?> e) {
        String[] parts = e.name().toLowerCase().split("_");
        StringBuilder sb = new StringBuilder(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            sb.append(Character.toUpperCase(parts[i].charAt(0)))
                    .append(parts[i].substring(1));
        }
        return sb.toString();
    }
}

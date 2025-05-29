package org.example.backend.domain.quizAccuracy.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAccuracy.dto.response.QuizAccuracyResponseDTO;
import org.example.backend.domain.quizAccuracy.entity.QuizAccuracy;
import org.example.backend.domain.quizAccuracy.repository.QuizAccuracyRepository;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizAccuracyServiceImpl implements QuizAccuracyService {

    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final OptionRepository optionRepository;
    private final QuizAccuracyRepository quizAccuracyRepository;

    // 퀴즈 목록, 정답률 조회
    @Override
    public QuizAccuracyResponseDTO getQuizResult(UUID lectureId) {
        List<Quiz> quizzes = quizRepository.findByLectureId(lectureId);

        List<QuizAccuracyResponseDTO.QuizDTO> quizList = new ArrayList<>();
        double sumRate = 0;

        for (Quiz quiz : quizzes) {
            List<QuizAnswer> answers = quizAnswerRepository.findAllByQuizId(quiz.getId());

            double correctRate;
            Optional<QuizAccuracy> accuracyOpt = quizAccuracyRepository.findByQuizId(quiz.getId());

            // DB에 계산된 정답률이 없는 경우에만 계산
            if (accuracyOpt.isPresent()) {
                correctRate = accuracyOpt.get().getCorrectRate();
            } else {
                long total = answers.size();
                long correct = answers.stream().filter(QuizAnswer::isCollect).count();
                correctRate = total == 0 ? 0.0 : (double) correct * 100 / total;

                quizAccuracyRepository.save(QuizAccuracy.builder()
                        .quiz(quiz)
                        .correctRate(correctRate)
                        .build());
            }

            sumRate += correctRate;

            QuizType type = quiz.getType();
            String camelType = toCamelCase(type.name());

            QuizAccuracyResponseDTO.QuizDTO.QuizDTOBuilder builder = QuizAccuracyResponseDTO.QuizDTO.builder()
                    .quizId(quiz.getId())
                    .quizOrder(quiz.getQuizOrder())
                    .type(camelType)
                    .quizBody(quiz.getQuiz())
                    .correctRate(correctRate)
                    .solution(quiz.getSolution());

            if (type == QuizType.MULTIPLE_CHOICE) {
                List<Option> options = optionRepository.findByQuizId(quiz.getId());
                List<QuizAccuracyResponseDTO.OptionCountDTO> optionDTOs = options.stream()
                        .map(opt -> QuizAccuracyResponseDTO.OptionCountDTO.builder()
                                .optionOrder(opt.getOptionOrder())
                                .option(opt.getText())
                                .count((int) answers.stream().filter(a -> opt.getText().equals(a.getAnswer())).count())
                                .build())
                        .toList();
                builder.options(optionDTOs);
            } else if (type == QuizType.TRUE_FALSE) {
                List<QuizAccuracyResponseDTO.OptionCountDTO> tfOptions = List.of(
                        QuizAccuracyResponseDTO.OptionCountDTO.builder().option("O")
                                .count((int) answers.stream().filter(a -> "O".equals(a.getAnswer())).count())
                                .optionOrder(null)
                                .build(),
                        QuizAccuracyResponseDTO.OptionCountDTO.builder().option("X")
                                .count((int) answers.stream().filter(a -> "X".equals(a.getAnswer())).count())
                                .optionOrder(null)
                                .build()
                );
                builder.options(tfOptions);
            } else if (type == QuizType.SHORT_ANSWER) {
                int correctCount = (int) answers.stream().filter(QuizAnswer::isCollect).count();
                builder.count(correctCount);
            }

            quizList.add(builder.build());
        }

        double average = quizzes.isEmpty() ? 0 : sumRate / quizzes.size();

        return QuizAccuracyResponseDTO.builder()
                .totalQuizCount(quizzes.size())
                .averageCorrectRate(Math.round(average * 10) / 10.0)
                .quizList(quizList)
                .build();
    }

    private String toCamelCase(String enumName) {
        String[] parts = enumName.toLowerCase().split("_");
        if (parts.length == 1) return parts[0];
        return parts[0] + Character.toUpperCase(parts[1].charAt(0)) + parts[1].substring(1);
    }
}

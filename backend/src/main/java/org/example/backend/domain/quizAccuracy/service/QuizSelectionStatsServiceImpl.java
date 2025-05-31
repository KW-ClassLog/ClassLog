package org.example.backend.domain.quizAccuracy.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.option.entity.Option;
import org.example.backend.domain.option.repository.OptionRepository;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.quizAccuracy.dto.response.QuizSelectionStatsResponseDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizSelectionStatsServiceImpl implements QuizSelectionStatsService {

    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final OptionRepository optionRepository;

    @Override
    public QuizSelectionStatsResponseDTO getQuizSelectionStats(UUID lectureId) {
        List<Quiz> quizzes = quizRepository.findByLectureId(lectureId);

        if (quizzes.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_FOUND);
        }

        List<QuizSelectionStatsResponseDTO.QuizStatDTO> quizStatDTOList = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            List<QuizAnswer> answers = quizAnswerRepository.findAllByQuizId(quiz.getId());
            long totalAnswers = answers.size();

            QuizType type = quiz.getType();
            String camelType = QuizType.toCamelCase(type.name());

            QuizSelectionStatsResponseDTO.QuizStatDTO.QuizStatDTOBuilder builder = QuizSelectionStatsResponseDTO.QuizStatDTO.builder()
                    .quizId(quiz.getId())
                    .quizOrder(quiz.getQuizOrder())
                    .type(camelType);

            if (type == QuizType.MULTIPLE_CHOICE) {
                List<Option> options = optionRepository.findByQuizId(quiz.getId());
                Map<String, Double> optionRatesMap = new HashMap<>();
                Map<String, Long> submittedAnswerCounts = answers.stream()
                        .collect(Collectors.groupingBy(QuizAnswer::getAnswer, Collectors.counting()));
                for (Option option : options) {
                    long countForThisOption = submittedAnswerCounts.getOrDefault(option.getText(), 0L);
                    double rate = (totalAnswers == 0) ? 0.0 : (double) countForThisOption * 100 / totalAnswers;
                    optionRatesMap.put(String.valueOf(option.getOptionOrder()), rate);
                }
                builder.optionRates(optionRatesMap);
            } else if (type == QuizType.TRUE_FALSE) {
                Map<String, Double> oxRatesMap = new HashMap<>();
                long oCount = answers.stream().filter(a -> "O".equalsIgnoreCase(a.getAnswer())).count();
                long xCount = answers.stream().filter(a -> "X".equalsIgnoreCase(a.getAnswer())).count();
                double oRate = (totalAnswers == 0) ? 0.0 : (double) oCount * 100 / totalAnswers;
                double xRate = (totalAnswers == 0) ? 0.0 : (double) xCount * 100 / totalAnswers;
                oxRatesMap.put("O", oRate);
                oxRatesMap.put("X", xRate);
                builder.oxRates(oxRatesMap);
            } else if (type == QuizType.SHORT_ANSWER) {
                Map<String, Long> countMap = answers.stream()
                        .filter(ans -> ans.getAnswer() != null && !ans.getAnswer().trim().isEmpty())
                        .collect(Collectors.groupingBy(QuizAnswer::getAnswer, Collectors.counting()));
                List<Map.Entry<String, Long>> sortedAnswers = countMap.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .toList();
                List<QuizSelectionStatsResponseDTO.AnswerRateDTO> top3AnswerRates = new ArrayList<>();
                List<String> etcAnswersList = new ArrayList<>();
                for (int i = 0; i < sortedAnswers.size(); i++) {
                    Map.Entry<String, Long> entry = sortedAnswers.get(i);
                    String answerText = entry.getKey();
                    double rate = (totalAnswers == 0) ? 0.0 : (double) entry.getValue() * 100 / totalAnswers;
                    if (i < 3) {
                        top3AnswerRates.add(new QuizSelectionStatsResponseDTO.AnswerRateDTO(answerText, rate));
                    } else {
                        etcAnswersList.add(answerText);
                    }
                }
                builder.top3Answers(top3AnswerRates);
                builder.etcAnswers(etcAnswersList);
            }
            quizStatDTOList.add(builder.build());
        }

        return QuizSelectionStatsResponseDTO.builder()
                .result(quizStatDTOList)
                .build();
    }
}
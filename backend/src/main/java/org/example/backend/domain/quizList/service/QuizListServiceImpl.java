package org.example.backend.domain.quizList.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.entity.QuizType;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizList.entity.QuizList;
import org.example.backend.domain.quizList.repository.QuizListRepository;
import org.example.backend.domain.quizListOptions.entity.QuizListOptions;
import org.example.backend.domain.quizListOptions.repository.QuizListOptionsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizListServiceImpl implements QuizListService {

    private final LectureRepository lectureRepository;
    private final QuizListRepository quizListRepository;
    private final QuizListOptionsRepository quizListOptionsRepository;

    @Override
    @Transactional
    public QuizResponseDTO createRandomQuizSet(UUID lectureId) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        List<QuizList> multipleChoiceList = quizListRepository.findRandomByLectureIdAndType(lectureId, QuizType.MULTIPLE_CHOICE.name(), 2);
        List<QuizList> shortAnswerList = quizListRepository.findRandomByLectureIdAndType(lectureId, QuizType.SHORT_ANSWER.name(), 1);
        List<QuizList> trueFalseList = quizListRepository.findRandomByLectureIdAndType(lectureId, QuizType.TRUE_FALSE.name(), 1);

        List<QuizList> allSelected = new ArrayList<>();
        allSelected.addAll(multipleChoiceList);
        allSelected.addAll(shortAnswerList);
        allSelected.addAll(trueFalseList);

        if (allSelected.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_GENERATED_YET);
        }

        allSelected.forEach(quiz -> quiz.setUsed("T"));
        quizListRepository.saveAll(allSelected);

        List<QuizResponseDTO.QuizDTO> quizDTOs = allSelected.stream()
                .map(quiz -> {
                    List<String> options = new ArrayList<>();

                    if (quiz.getType() == QuizType.MULTIPLE_CHOICE) {
                        options = quizListOptionsRepository.findByQuizListId_Id(quiz.getId())
                                .stream()
                                .map(QuizListOptions::getText)
                                .toList();
                    }

                    String camelType = QuizType.toCamelCase(quiz.getType().name());

                    return QuizResponseDTO.QuizDTO.builder()
                            .quizBody(quiz.getQuiz())
                            .solution(quiz.getSolution())
                            .type(camelType) // e.g. "multipleChoice", "shortAnswer", "trueFalse"
                            .options(options)
                            .build();
                })
                .toList();

        return QuizResponseDTO.builder()
                .lectureId(lectureId)
                .quizzes(quizDTOs)
                .build();
    }

    @Override
    @Transactional
    public QuizResponseDTO recreateRandomQuizSet(UUID lectureId) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LECTURE_NOT_FOUND));

        List<QuizList> multipleChoiceList = quizListRepository.findRandomByLectureIdAndTypeExcludeUsed(lectureId, QuizType.MULTIPLE_CHOICE.name(), 2);
        List<QuizList> shortAnswerList = quizListRepository.findRandomByLectureIdAndTypeExcludeUsed(lectureId, QuizType.SHORT_ANSWER.name(), 1);
        List<QuizList> trueFalseList = quizListRepository.findRandomByLectureIdAndTypeExcludeUsed(lectureId, QuizType.TRUE_FALSE.name(), 1);

        List<QuizList> allSelected = new ArrayList<>();
        allSelected.addAll(multipleChoiceList);
        allSelected.addAll(shortAnswerList);
        allSelected.addAll(trueFalseList);

        if (allSelected.isEmpty()) {
            throw new QuizException(QuizErrorCode.QUIZ_NOT_GENERATED_YET);
        }

        allSelected.forEach(quiz -> quiz.setUsed("T"));
        quizListRepository.saveAll(allSelected);

        List<QuizResponseDTO.QuizDTO> quizDTOs = allSelected.stream()
                .map(quiz -> {
                    List<String> options = new ArrayList<>();

                    if (quiz.getType() == QuizType.MULTIPLE_CHOICE) {
                        options = quizListOptionsRepository.findByQuizListId_Id(quiz.getId())
                                .stream()
                                .map(QuizListOptions::getText)
                                .toList();
                    }

                    String camelType = QuizType.toCamelCase(quiz.getType().name());

                    return QuizResponseDTO.QuizDTO.builder()
                            .quizBody(quiz.getQuiz())
                            .solution(quiz.getSolution())
                            .type(camelType)
                            .options(options)
                            .build();
                })
                .toList();

        quizListRepository.resetAllUsedFlags();

        return QuizResponseDTO.builder()
                .lectureId(lectureId)
                .quizzes(quizDTOs)
                .build();
    }
}
package org.example.backend.domain.quizAnswer.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.quiz.entity.Quiz;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.repository.QuizRepository;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitListResponseDTO;
import org.example.backend.domain.quizAnswer.entity.QuizAnswer;
import org.example.backend.domain.quizAnswer.repository.QuizAnswerRepository;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.security.auth.CustomSecurityUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizAnswerServiceImpl implements QuizAnswerService {

    private final LectureRepository lectureRepository;
    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final UserRepository userRepository;
    private final CustomSecurityUtil customSecurityUtil;


    // 퀴즈 제출 학생 목록 조회
    @Override
    public QuizSubmitListResponseDTO getQuizSubmitList(UUID lectureId) {

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

        List<Quiz> quizzes = quizRepository.findByLectureId(lectureId);
        if (quizzes.isEmpty()) {
            return QuizSubmitListResponseDTO.builder()
                    .lectureId(lectureId)
                    .submitNum(0)
                    .studentList(List.of())
                    .build();
        }

        UUID quizId = quizzes.get(0).getId();
        List<QuizAnswer> answers = quizAnswerRepository.findAllByQuizId(quizId);

        List<QuizSubmitListResponseDTO.StudentSubmitDTO> studentList = answers.stream()
                .map(answer -> {
                    User user = userRepository.findById(answer.getUser().getId())
                            .orElseThrow();
                    return QuizSubmitListResponseDTO.StudentSubmitDTO.builder()
                            .name(user.getName())
                            .submitDate(answer.getCreatedAt())
                            .build();
                })
                .sorted((a, b) -> a.getSubmitDate().compareTo(b.getSubmitDate()))
                .toList();

        return QuizSubmitListResponseDTO.builder()
                .lectureId(lectureId)
                .submitNum(studentList.size())
                .studentList(studentList)
                .build();
    }
}

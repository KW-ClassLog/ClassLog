package org.example.backend.domain.question.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.converter.QuestionConverter;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.example.backend.domain.question.repository.QuestionRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final StudentClassRepository studentClassRepository;
    private final QuestionConverter questionConverter;

    @Override
    public List<QuestionResponseDTO.teacher> getTeacherQuestions(UUID lectureId, User user ) {

        return questionRepository.findByLectureId(lectureId).stream()
                .map(questionConverter::toTeacherQuestions)
                .toList();
    }

    @Override
    public List<QuestionResponseDTO.student> getStudentQuestions(UUID lectureId, User user) {
        // 수강 여부 조회
        boolean isEnrolled = studentClassRepository.existsByUserIdAndLectureId(user.getId(),lectureId);

        if(!isEnrolled){
            throw new QuestionException(QuestionErrorCode._FORBIDDEN_LECTURE_ACCESS);
        }
        return questionRepository.findByLectureId(lectureId).stream()
                .map(questionConverter::toStudentQuestions)
                .toList();
    }
}

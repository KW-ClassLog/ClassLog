package org.example.backend.domain.question.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.converter.QuestionConverter;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.exception.QuestionErrorCode;
import org.example.backend.domain.question.exception.QuestionException;
import org.example.backend.domain.question.repository.QuestionRepository;
import org.example.backend.domain.studentClass.repository.StudentClassRepository;
import org.example.backend.domain.user.entity.SocialType;
import org.example.backend.domain.user.entity.User;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.example.backend.domain.user.repository.UserRepository;
import org.example.backend.global.S3.service.S3Service;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.exception.GeneralException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final StudentClassRepository studentClassRepository;
    private final QuestionConverter questionConverter;
    private final S3Service s3Service;
    private final UserRepository userRepository;

    @Override
    public List<QuestionResponseDTO.teacher> getTeacherQuestions(UUID lectureId, User user) {

        return questionRepository.findByLectureId(lectureId).stream()
                .map(question -> {
                    User student = userRepository.findById(question.getUser().getId())
                            .orElseThrow(() -> new UserException(UserErrorCode._USER_NOT_FOUND));

                    String profileUrl;

                    if (student.getProfileUrl() != null && user.getSocialType() == SocialType.LOCAL) {
                        try {
                            profileUrl = s3Service.getSignedUrl(user.getProfileUrl());
                        } catch (IOException | InvalidKeySpecException e) {
                            throw new GeneralException(FailureCode._INTERNAL_SERVER_ERROR);
                        }
                    } else {
                        profileUrl = student.getProfileUrl();
                    }
                    return questionConverter.toTeacherQuestions(question, profileUrl);
                })
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

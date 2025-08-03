package org.example.backend.domain.question.converter;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.entity.Question;
import org.example.backend.domain.user.entity.SocialType;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class QuestionConverter {

    private final S3Service s3Service;

    public QuestionResponseDTO.teacher toTeacherQuestions(Question question) {
        String profileUrl = question.getUser().getSocialType() == SocialType.LOCAL?
                s3Service.getPublicUrl(question.getUser().getProfileUrl()) : question.getUser().getProfileUrl();

        return QuestionResponseDTO.teacher.builder()
                .studentId(question.getUser().getId())
                .studentName(question.getUser().getName())
                .studentProfile(profileUrl)
                .content(question.getContent())
                .timestamp(question.getTimestamp())
                .build();
    }

    public QuestionResponseDTO.student toStudentQuestions(Question question) {
        return QuestionResponseDTO.student.builder()
                .content(question.getContent())
                .timestamp(question.getTimestamp())
                .build();
    }
}

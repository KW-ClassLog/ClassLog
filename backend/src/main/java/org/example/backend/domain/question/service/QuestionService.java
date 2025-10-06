package org.example.backend.domain.question.service;

import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface QuestionService {
    // 강사용 질문 조회
    List<QuestionResponseDTO.teacher> getTeacherQuestions(UUID lectureId, User user);
    //학생용 질문 조회
    List<QuestionResponseDTO.student> getStudentQuestions(UUID lectureId, User user);
    // 이전 채팅 내용 불러오개
    List<QuestionResponseDTO.beforeChatting> getBeforeChatting(UUID lectureId);
    // 채팅 내용 저장
    void saveChatting(UUID lectureId);
}

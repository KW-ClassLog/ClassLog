package org.example.backend.domain.question.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.question.dto.response.QuestionResponseDTO;
import org.example.backend.domain.question.service.QuestionService;
import org.example.backend.domain.user.entity.Role;
import org.example.backend.domain.user.entity.User;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lectures")
public class QuestionController {
    private final QuestionService questionService;

    // 질문 조회
    @GetMapping("/{lectureId}/questions")
    public ApiResponse<?> getQuestions(@PathVariable("lectureId") UUID lectureId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        User user = ((CustomUserDetails) principal).getUser();

        if(user.getRole() == Role.TEACHER){
            List<QuestionResponseDTO.teacher> result = questionService.getTeacherQuestions(lectureId,user);
            return ApiResponse.onSuccess(result);
        } else{
            List<QuestionResponseDTO.student> result = questionService.getStudentQuestions(lectureId,user);
            return ApiResponse.onSuccess(result);
        }
    }

    // 이전 내용 불러오기
    @GetMapping("/chatting/before/{lectureId}")
    public ApiResponse<List<QuestionResponseDTO.beforeChatting>> getBeforeChatting(@PathVariable("lectureId") UUID lectureId) {
        List<QuestionResponseDTO.beforeChatting> result = questionService.getBeforeChatting(lectureId);
        return ApiResponse.onSuccess(result);
    }

    // 채팅 내용 저장하기
    @PostMapping("/chatting/after/{lectureId}")
    public ApiResponse<String> afterChatting(@PathVariable("lectureId") UUID lectureId) {
        questionService.saveChatting(lectureId);
        return ApiResponse.onSuccess(null);
    }
}

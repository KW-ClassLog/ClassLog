package org.example.backend.domain.quiz.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.service.QuizService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/{lectureId}/create")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> generateQuiz(@PathVariable UUID lectureId,
                                                                     @RequestBody QuizRequestDTO request) {
        try {
            QuizResponseDTO response = quizService.generateQuiz(lectureId, request);
            return ResponseEntity.ok(ApiResponse.onSuccess(response));
        } catch (QuizException e) {
            return ResponseEntity
                    .status(e.getErrorCode().getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(e.getErrorCode()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(FailureCode._INTERNAL_SERVER_ERROR.getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(FailureCode._INTERNAL_SERVER_ERROR));
        }
    }
}
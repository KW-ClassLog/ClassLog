package org.example.backend.domain.quizAccuracy.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizAccuracy.dto.response.QuizAccuracyResponseDTO;
import org.example.backend.domain.quizAccuracy.service.QuizAccuracyService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizAccuracyController {

    private final QuizAccuracyService quizAccuracyService;

    // 퀴즈 목록, 정답률 조회
    @GetMapping("/{lectureId}/result")
    public ResponseEntity<ApiResponse<QuizAccuracyResponseDTO>> getQuizResult(@PathVariable UUID lectureId) {
        try {
            QuizAccuracyResponseDTO result = quizAccuracyService.getQuizResult(lectureId);
            return ResponseEntity.ok(ApiResponse.onSuccess(result));
        } catch (QuizException e) {
            return ResponseEntity.status(e.getErrorCode().getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(e.getErrorCode()));
        } catch (Exception e) {
            return ResponseEntity.status(FailureCode._INTERNAL_SERVER_ERROR.getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(FailureCode._INTERNAL_SERVER_ERROR));
        }
    }

}

package org.example.backend.domain.quizList.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizList.service.QuizListService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizListController {

    private final QuizListService quizListService;

    @PostMapping("/{lectureId}/create")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> createRandomQuiz(
            @PathVariable("lectureId") UUID lectureId) {
        try {
            QuizResponseDTO response = quizListService.createRandomQuizSet(lectureId);
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

    @PostMapping("/{lectureId}/re-create")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> recreateRandomQuiz(
            @PathVariable("lectureId") UUID lectureId) {
        try {
            QuizResponseDTO response = quizListService.recreateRandomQuizSet(lectureId);
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

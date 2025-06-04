package org.example.backend.domain.quiz.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quiz.dto.request.QuizEditRequestDTO;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.request.QuizSaveRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizEditResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.dto.response.QuizSaveResponseDTO;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quiz.service.QuizEditService;
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
    private final QuizEditService quizEditService;

    // 퀴즈 생성
    @PostMapping("/{lectureId}/create")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> generateQuiz(@PathVariable("lectureId") UUID lectureId,
                                                                     @RequestBody QuizRequestDTO request) {
        try {
            QuizResponseDTO response = quizService.generateQuiz(lectureId, request, false);
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

    // 퀴즈 재생성
    @PostMapping("/{lectureId}/re-create")
    public ResponseEntity<ApiResponse<QuizResponseDTO>> regenerateQuiz(@PathVariable("lectureId") UUID lectureId,
                                                                       @RequestBody QuizRequestDTO request) {
        try {
            QuizResponseDTO response = quizService.generateQuiz(lectureId, request, true);
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

    // 퀴즈 저장
    @PostMapping("/{lectureId}")
    public ResponseEntity<ApiResponse<QuizSaveResponseDTO>> saveQuiz(@PathVariable("lectureId") UUID lectureId,
                                                            @RequestBody QuizSaveRequestDTO request) {
        try {
            QuizSaveResponseDTO response = quizService.saveQuiz(lectureId, request);
            return ResponseEntity.ok(ApiResponse.onSuccess(response));
        } catch (QuizException e) {
            return ResponseEntity
                    .status(e.getErrorCode().getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(e.getErrorCode()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(FailureCode._INTERNAL_SERVER_ERROR.getReasonHttpStatus().getHttpStatus())
                    .body(ApiResponse.onFailure(FailureCode._INTERNAL_SERVER_ERROR));
        }
    }

    // 퀴즈 문제 수정
    @PatchMapping("/{lectureId}/edit")
    public ResponseEntity<ApiResponse<QuizEditResponseDTO>> editQuiz(@PathVariable("lectureId") UUID lectureId,
                                                                     @RequestBody QuizEditRequestDTO request) {
        try {
            QuizEditResponseDTO response = quizEditService.editQuiz(lectureId, request);
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
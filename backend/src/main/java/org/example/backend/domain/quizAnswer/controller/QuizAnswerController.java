package org.example.backend.domain.quizAnswer.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quizAnswer.dto.response.QuizInfoResponseDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitListResponseDTO;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizAnswer.service.QuizAnswerService;
import org.example.backend.domain.quiz.service.QuizService;
import org.example.backend.domain.quizAnswer.service.QuizInfoService;
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
public class QuizAnswerController {

    private final QuizAnswerService quizResultService;
    private final QuizInfoService quizInfoService;

    // 퀴즈 제출 학생 목록 조회
    @GetMapping("/{lectureId}/result/list")
    public ResponseEntity<ApiResponse<QuizSubmitListResponseDTO>> getQuizSubmitList(@PathVariable("lectureId") UUID lectureId) {
        try {
            QuizSubmitListResponseDTO result = quizResultService.getQuizSubmitList(lectureId);
            return ResponseEntity.ok(ApiResponse.onSuccess(result));
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

    // 퀴즈 정보 조회
    @GetMapping("/{lectureId}/result/info")
    public ResponseEntity<ApiResponse<QuizInfoResponseDTO>> getQuizInfo(@PathVariable("lectureId") UUID lectureId) {
        try{
            QuizInfoResponseDTO result = quizInfoService.getQuizInfo(lectureId);
            return ResponseEntity.ok(ApiResponse.onSuccess(result));
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


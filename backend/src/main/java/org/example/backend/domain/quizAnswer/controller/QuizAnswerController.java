package org.example.backend.domain.quizAnswer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.quizAnswer.dto.request.QuizSubmitRequestDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizInfoResponseDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizResultStudentResponseDTO;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitListResponseDTO;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.domain.quizAnswer.dto.response.QuizSubmitResponseDTO;
import org.example.backend.domain.quizAnswer.service.QuizAnswerService;
import org.example.backend.domain.quizAnswer.service.QuizInfoService;
import org.example.backend.domain.quizAnswer.service.QuizResultStudentService;
import org.example.backend.domain.quizAnswer.service.QuizSubmitService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.code.base.FailureCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizAnswerController {

    private final QuizAnswerService quizAnswerService;
    private final QuizInfoService quizInfoService;
    private final QuizSubmitService quizSubmitService;
    private final QuizResultStudentService quizResultStudentService;


    // 퀴즈 제출 학생 목록 조회
    @GetMapping("/{lectureId}/result/list")
    public ResponseEntity<ApiResponse<QuizSubmitListResponseDTO>> getQuizSubmitList(@PathVariable("lectureId") UUID lectureId) {
        try {
            QuizSubmitListResponseDTO result = quizAnswerService.getQuizSubmitList(lectureId);
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

    // 퀴즈 제출 + 채점
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<QuizSubmitResponseDTO>> submitQuiz(
            @RequestBody @Valid QuizSubmitRequestDTO request) {
        try {
            QuizSubmitResponseDTO result = quizSubmitService.submitQuizAnswers(request);
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

    // 학생 별 퀴즈 선택 결과
    @GetMapping("/{lectureId}/result/student")
    public ResponseEntity<ApiResponse<QuizResultStudentResponseDTO>> getQuizResult(@PathVariable("lectureId") UUID lectureId) {
        try{
            QuizResultStudentResponseDTO result = quizResultStudentService.getQuizResult(lectureId);
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


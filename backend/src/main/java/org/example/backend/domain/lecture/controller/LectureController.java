package org.example.backend.domain.lecture.controller;


import jakarta.validation.Valid;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.service.LectureService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {
    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {this.lectureService=lectureService;}

    // Lecture 생성
    @PostMapping("/create")
    public ApiResponse<Void> createLecture(@Valid @RequestBody LectureRequestDTO dto) {
        lectureService.createLecture(dto);
        return ApiResponse.onSuccess(null);
    }

    @GetMapping("/{lectureId}")
    public ApiResponse<LectureResponseDTO> getLecture(@PathVariable UUID lectureId) {
        LectureResponseDTO dto = lectureService.getLectureDetail(lectureId);
        return ApiResponse.onSuccess(dto); // 🎯 DTO만 응답
    }

    // Lecture 수정
    @PatchMapping("/{lectureId}")
    public ApiResponse<Void> updateLecture(@PathVariable UUID lectureId,
                                           @RequestBody LectureRequestDTO dto) {
        lectureService.updateLecture(lectureId, dto);
        return ApiResponse.onSuccess(null);
    }

    // Lecture 삭제
    @DeleteMapping("/{lectureId}")
    public ApiResponse<Void> deleteLecture(@PathVariable UUID lectureId) {
        lectureService.deleteLecture(lectureId);
        return ApiResponse.onSuccess(null);
    }

}

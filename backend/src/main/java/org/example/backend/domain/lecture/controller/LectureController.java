package org.example.backend.domain.lecture.controller;


import jakarta.validation.Valid;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.service.LectureService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {
    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {this.lectureService=lectureService;}

    @PostMapping("/create")
    public ApiResponse<Void> createLecture(@Valid @RequestBody LectureRequestDTO dto) {
        lectureService.createLecture(dto);
        return ApiResponse.onSuccess(null);
    }

}

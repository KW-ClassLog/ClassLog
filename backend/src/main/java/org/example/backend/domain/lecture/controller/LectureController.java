package org.example.backend.domain.lecture.controller;


import jakarta.validation.Valid;
import org.example.backend.domain.lecture.converter.LectureConverter;
import org.example.backend.domain.lecture.dto.request.LectureNoteMappingRequestDTO;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.LectureIdResponseDTO;
import org.example.backend.domain.lecture.dto.response.LectureNoteMappingResponseDTO;
import org.example.backend.domain.lecture.dto.response.LectureResponseDTO;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.service.LectureService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {
    private final LectureService lectureService;
    private final LectureConverter lectureConverter;

    public LectureController(LectureService lectureService, LectureConverter lectureConverter) {this.lectureService=lectureService;
        this.lectureConverter = lectureConverter;
    }

    // Lecture 생성
    @PostMapping("/create")
    public ApiResponse<LectureIdResponseDTO> createLecture(@Valid @RequestBody LectureRequestDTO dto) {
        Lecture lecture = lectureService.createLecture(dto);
        LectureIdResponseDTO responseDTO = lectureConverter.toResponseIdDTO(lecture);
        return ApiResponse.onSuccess(responseDTO);
    }

    // Lecture 조회
    @GetMapping("/{classId}/{lectureId}")
    public ApiResponse<LectureResponseDTO> getLecture(@PathVariable UUID lectureId , @PathVariable UUID classId) {
        LectureResponseDTO dto = lectureService.getLectureDetail(classId,lectureId);
        return ApiResponse.onSuccess(dto);
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

    //강의록 맵핑
    @PostMapping("/{lectureId}/notes/mapping")
    public ApiResponse<LectureNoteMappingResponseDTO> mapNotesToLecture(
            @PathVariable UUID lectureId,
            @RequestBody LectureNoteMappingResponseDTO request) {

        List<UUID> result = lectureService.mapNotes(lectureId, request.getLectureNoteIds());
        return ApiResponse.onSuccess(new LectureNoteMappingResponseDTO(result));
    }



}

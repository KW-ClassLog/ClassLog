package org.example.backend.domain.lecture.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.converter.LectureConverter;
import org.example.backend.domain.lecture.dto.request.LectureNoteMappingRequestDTO;
import org.example.backend.domain.lecture.dto.request.LectureRequestDTO;
import org.example.backend.domain.lecture.dto.response.*;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.service.LectureService;
import org.example.backend.domain.lecture.service.LectureStudentService;
import org.example.backend.global.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lectures")
public class LectureController {
    private final LectureService lectureService;
    private final LectureConverter lectureConverter;
    private final LectureStudentService lectureStudentService;


    // Lecture 생성
    @PostMapping("/create")
    public ApiResponse<LectureIdResponseDTO> createLecture(@Valid @RequestBody LectureRequestDTO dto) {
        Lecture lecture = lectureService.createLecture(dto);
        LectureIdResponseDTO responseDTO = lectureConverter.toResponseIdDTO(lecture);
        return ApiResponse.onSuccess(responseDTO);
    }

    // Lecture 조회
    @GetMapping("/{lectureId}")
    public ApiResponse<LectureResponseDTO> getLecture(@PathVariable("lectureId") UUID lectureId) {
        LectureResponseDTO dto = lectureService.getLectureDetail(lectureId);
        return ApiResponse.onSuccess(dto);
    }

    // Lecture 수정
    @PatchMapping("/{lectureId}")
    public ApiResponse<Void> updateLecture(@PathVariable("lectureId") UUID lectureId,
                                           @RequestBody LectureRequestDTO dto) {
        lectureService.updateLecture(lectureId, dto);
        return ApiResponse.onSuccess(null);
    }

    // Lecture 삭제
    @DeleteMapping("/{lectureId}")
    public ApiResponse<Void> deleteLecture(@PathVariable("lectureId") UUID lectureId) {
        lectureService.deleteLecture(lectureId);
        return ApiResponse.onSuccess(null);
    }

    //강의록 맵핑
    @PostMapping("/{lectureId}/notes/mapping")
    public ApiResponse<LectureNoteMappingResponseDTO> mapNotesToLecture(
            @PathVariable("lectureId") UUID lectureId,
            @RequestBody LectureNoteMappingRequestDTO request) {

        List<UUID> result = lectureService.mapNotes(lectureId, request.getLectureNoteIds());
        return ApiResponse.onSuccess(new LectureNoteMappingResponseDTO(result));
    }



    @PostMapping(value = "/{lectureId}/recordings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<LectureRecordingResponseDTO> uploadRecording(
            @PathVariable("lectureId") UUID lectureId,
            @RequestParam("file") MultipartFile file) {

        LectureRecordingResponseDTO result = lectureService.uploadLectureRecording(lectureId, file);
        return ApiResponse.onSuccess(result);
    }

    //녹음본 조회
    @GetMapping("/{lectureId}/recordings")
    public ApiResponse<LectureRecordingResponseDTO> getRecording(@PathVariable("lectureId") UUID lectureId) {
        LectureRecordingResponseDTO result = lectureService.getLectureRecording(lectureId);
        return ApiResponse.onSuccess(result);
    }

    //교수의 오늘의 강의 조회
    @GetMapping("/teacher/today")
    public ApiResponse<List<TodayLectureResponseDTO>> getTeacherLecture(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TodayLectureResponseDTO> responseDTOs = lectureService.getClassListByProfessor(date);
        return ApiResponse.onSuccess(responseDTOs);
    }

    //학생의 오늘의 강의 조회
    @GetMapping("/student/today")
    public ApiResponse<StudentTodayLectureResponseDTO> getStudentLectures(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        StudentTodayLectureResponseDTO result = lectureStudentService.getClassListByStudent(date);
        return ApiResponse.onSuccess(result);
    }

    // lecture id로 class id 조회
    @GetMapping("/classes/{lectureId}")
    public ApiResponse<ClassNameResponseDTO> getClassId(@PathVariable("lectureId") UUID lectureId) {
        ClassNameResponseDTO result = lectureService.getClassId(lectureId);
        return ApiResponse.onSuccess(result);
    }

    // 학생용 강의 조회
    @GetMapping("/student/{lectureId}")
    public ApiResponse<LectureResponseDTO> getStudnetLecture(@PathVariable("lectureId") UUID lectureId) {
        LectureResponseDTO result = lectureStudentService.getLecture(lectureId);
        return ApiResponse.onSuccess(result);
    }
}
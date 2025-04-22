package org.example.backend.domain.classroom.controller;

import jakarta.validation.Valid;
import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.service.ClassroomService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping ("/api/classes")
public class ClassroomController {
    private final ClassroomService classroomService;
    private final ClassroomConverter classroomConverter;

    public ClassroomController(ClassroomService classroomService, ClassroomConverter classroomConverter) {
        this.classroomService = classroomService;
        this.classroomConverter = classroomConverter;
    }
    // 클래스 생성
    @PostMapping("/create")
    public ApiResponse<ClassroomResponseDTO> createClassroom(@Valid @RequestBody ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomService.createClassroom(classroomRequestDTO);
        ClassroomResponseDTO response = classroomConverter.toResponseDTO(classroom);
        return ApiResponse.onSuccess(response);
    }
    // 클래스 조회
    @GetMapping("/{classId}")
    public ApiResponse<ClassroomResponseDTO> getClassroom(@PathVariable UUID classId) {
        Classroom classroom = classroomService.getClassroom(classId);
        ClassroomResponseDTO response = classroomConverter.toResponseDTO(classroom);

        return ApiResponse.onSuccess(response);
    }
    // 클래스 삭제
    @DeleteMapping("/{classId}")
    public ApiResponse<String> deleteClassroom(@PathVariable UUID classId) {
        classroomService.deleteClassroom(classId);
        return ApiResponse.onSuccess("Classroom deleted successfully");
    }
    //클래스 수정
    @PatchMapping("/{classId}")
    public ApiResponse<ClassroomResponseDTO> updateClassroom(@PathVariable UUID classId, @RequestBody ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomService.updateClassroom(classId, classroomRequestDTO);
        ClassroomResponseDTO response = classroomConverter.toResponseDTO(classroom);

        return ApiResponse.onSuccess(response);
    }
}

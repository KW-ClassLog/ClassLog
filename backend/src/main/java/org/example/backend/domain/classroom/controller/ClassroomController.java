package org.example.backend.domain.classroom.controller;

import jakarta.validation.Valid;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.service.ClassroomService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping ("/api/classes")
public class ClassroomController {
    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }
    // 클래스 생성
    @PostMapping("/create")
    public ApiResponse<Classroom> createClassroom(@Valid @RequestBody ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomService.createClassroom(classroomRequestDTO);

        return ApiResponse.onSuccess(classroom);
    }
    // 클래스 조회
    @GetMapping("/{classId}")
    public ApiResponse<Classroom> getClassroom(@PathVariable UUID classId) {
        Classroom classroom = classroomService.getClassroom(classId);

        return ApiResponse.onSuccess(classroom);
    }
    // 클래스 삭제
    @DeleteMapping("/{classId}")
    public ApiResponse<String> deleteClassroom(@PathVariable UUID classId) {
        classroomService.deleteClassroom(classId);
        return ApiResponse.onSuccess("Classroom deleted successfully");
    }
    //클래스 수정
    @PatchMapping("/{classId}")
    public ApiResponse<Classroom> updateClassroom(@PathVariable UUID classId, @RequestBody ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomService.updateClassroom(classId, classroomRequestDTO);

        return ApiResponse.onSuccess(classroom);
    }
}

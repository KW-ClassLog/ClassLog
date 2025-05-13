package org.example.backend.domain.classroom.controller;

import jakarta.validation.Valid;
import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassLectureResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseStudentDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.service.ClassroomService;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ApiResponse<ClassroomResponseStudentDTO> getClassroom(@PathVariable UUID classId) {
        Classroom classroom = classroomService.getClassroom(classId);
        ClassroomResponseStudentDTO response = classroomConverter.toResponseStudentDTO(classroom);

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

    //클래스에 속해있는 강의목록 조회
    @GetMapping("/{classId}/lectures")
    public ApiResponse<List<ClassLectureResponseDTO>> getLectureList(@PathVariable UUID classId){
        List<Lecture> lectures = classroomService.getLecturesByClassId(classId);

        List<ClassLectureResponseDTO> responseDTOs = classroomConverter.toDTOList(lectures);

        return ApiResponse.onSuccess(responseDTOs);

    }
    // 교수의 클래스 조회
    @GetMapping("/teacher/myclass")
    public ApiResponse<List<ClassroomResponseDTO>> getMyClassList() {
        // JWT 토큰에서 교수의 userId 추출 후, 해당 교수의 클래스 리스트 조회
        List<ClassroomResponseDTO> responseDTOs = classroomService.getClassListByProfessor();
        return ApiResponse.onSuccess(responseDTOs);
    }
}

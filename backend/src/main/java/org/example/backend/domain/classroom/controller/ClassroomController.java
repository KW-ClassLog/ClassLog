package org.example.backend.domain.classroom.controller;

import jakarta.validation.Valid;
import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassLectureResponseDTO;
import org.example.backend.domain.classroom.dto.request.EntryCodeVerifyRequestDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseDTO;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseStudentDTO;
import org.example.backend.domain.classroom.dto.response.EntryCodeResponseDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.service.ClassroomService;
import org.example.backend.global.ApiResponse;
import org.example.backend.global.security.auth.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.example.backend.domain.lecture.entity.Lecture;
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

    @GetMapping("/{classId}/lectures")
    public ApiResponse<List<ClassLectureResponseDTO>> getLectureList(@PathVariable UUID classId){
        List<Lecture> lectures = classroomService.getLecturesByClassId(classId);
        List<ClassLectureResponseDTO> responseDTOs = classroomService.getLectureDTOs(lectures);
        return ApiResponse.onSuccess(responseDTOs);
    }

    // 교수의 클래스 조회
    @GetMapping("/teacher/myclass")
    public ApiResponse<List<ClassroomResponseDTO>> getMyClassList() {
        // JWT 토큰에서 교수의 userId 추출 후, 해당 교수의 클래스 리스트 조회
        List<ClassroomResponseDTO> responseDTOs = classroomService.getClassListByProfessor();
        return ApiResponse.onSuccess(responseDTOs);
    }

    //클래스 입장코드 발급
    @GetMapping("/{classId}/code")
    public ApiResponse<EntryCodeResponseDTO> getEntryCode(@PathVariable UUID classId) {
        EntryCodeResponseDTO response = classroomService.generateCode(classId);
        return ApiResponse.onSuccess(response);
    }

    //입장코드 확인
    @PostMapping("/{classId}/code/verify")
    public ApiResponse<Boolean> verifyCode(@PathVariable UUID classId,
                                           @RequestBody EntryCodeVerifyRequestDTO request, @RequestHeader("Authorization") String token) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        UUID userId = ((CustomUserDetails) principal).getUser().getId();
        classroomService.checkAlreadyJoined(classId, userId);

        boolean valid = classroomService.validateEntryCode(classId, request.getEntry_code());

        if (!valid) {
            return ApiResponse.onFailure(ClassroomErrorCode.INVALID_ENTRY_CODE);
        }

        return ApiResponse.onSuccess(true);
    }

}

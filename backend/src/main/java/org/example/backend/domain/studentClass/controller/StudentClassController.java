package org.example.backend.domain.studentClass.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.classroom.dto.response.ClassroomResponseStudentDTO;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentEnrolledResponseDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;
import org.example.backend.domain.studentClass.service.StudentClassService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-classes")
public class StudentClassController {

    private final StudentClassService studentClassService;

    // 클래스 입장  & 닉네임 설정
    @PostMapping("/create")
    public ApiResponse<Void> enterClassroom(@RequestBody StudentClassRequestDTO studentClassRequestDTO){

        studentClassService.studentClassEnter(studentClassRequestDTO);
        return ApiResponse.onSuccess(null);
    }

    // 닉네임 수정
    @PatchMapping("nickname")
    public ApiResponse<Void> updateNickname(@RequestBody StudentClassRequestDTO studentClassRequestDTO){

        studentClassService.updateNickname(studentClassRequestDTO);
        return ApiResponse.onSuccess(null);
    }

    // 클래스별 닉네임 조회
    @GetMapping("nickname/{classId}")
    public ApiResponse<StudentClassResponseDTO> getNickname(@PathVariable("classId") UUID classId){

        StudentClassResponseDTO response = studentClassService.getNicknameByClassId(classId);
        return ApiResponse.onSuccess(response);
    }

    // 내가 참여중인 클래스 조회
    @GetMapping("/")
    public ApiResponse<List<ClassroomResponseStudentDTO>> getClassroomInfo(){

        List<ClassroomResponseStudentDTO> response = studentClassService.getClassroomByStudentId();
        return ApiResponse.onSuccess(response);
    }

    // 클래스 학생목록 조회
    @GetMapping("/{classId}/students")
    public ApiResponse<List<StudentEnrolledResponseDTO>> getStudentInfo(@PathVariable("classId") UUID classId){
        List<StudentEnrolledResponseDTO> response = studentClassService.getStudentByClassId(classId);
        return ApiResponse.onSuccess(response);
    }

}

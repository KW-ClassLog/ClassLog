package org.example.backend.domain.studentClass.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.studentClass.converter.StudentClassConverter;
import org.example.backend.domain.studentClass.dto.request.StudentClassRequestDTO;
import org.example.backend.domain.studentClass.dto.response.StudentClassResponseDTO;
import org.example.backend.domain.studentClass.service.StudentClassService;
import org.example.backend.global.ApiResponse;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-classes")
public class StudentClassController {

    private final StudentClassService studentClassService;
    private final StudentClassConverter studentClassConverter;

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
    public ApiResponse<StudentClassResponseDTO> getNickname(@PathVariable UUID classId){

        StudentClassResponseDTO response = studentClassService.getNicknameByClassId(classId);
        return ApiResponse.onSuccess(response);
    }

}

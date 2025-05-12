package org.example.backend.domain.studentClass.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.studentClass.dto.request.ClassEnterRequestDTO;
import org.example.backend.domain.studentClass.service.StudentClassService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-classes")
public class StudentClassController {

    private final StudentClassService studentClassService;

    // 클래스 입장  & 닉네임 설정
    @PostMapping
    public ApiResponse<String> enterClassroom(@RequestBody ClassEnterRequestDTO classEnterRequestDTO){
        UUID classId = classEnterRequestDTO.getClass_id();
        UUID studentId = classEnterRequestDTO.getStudent_id();

        studentClassService.studentClassEnter(classId, studentId);

        return ApiResponse.onSuccess("클래스 입장 성공");
    }

}

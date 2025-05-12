package org.example.backend.domain.studentClass.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.studentClass.dto.request.ClassEnterRequestDTO;
import org.example.backend.domain.studentClass.service.StudentClassService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/student-classes")
public class StudentClassController {

    private final StudentClassService studentClassService;

    // 클래스 입장  & 닉네임 설정
    @PostMapping("/create")
    public ApiResponse<String> enterClassroom(@RequestBody ClassEnterRequestDTO classEnterRequestDTO){

        studentClassService.studentClassEnter(classEnterRequestDTO);
        return ApiResponse.onSuccess("클래스 입장 성공");
    }

}

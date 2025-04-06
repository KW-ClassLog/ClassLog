package org.example.backend.domain.classroom.controller;

import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.service.ClassroomService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/api/classes")
public class ClassroomController {
    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping("/create")
    public ApiResponse<Classroom> createClassroom(@RequestBody ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomService.createClassroom(classroomRequestDTO);

        return ApiResponse.onSuccess(classroom);
    }
}

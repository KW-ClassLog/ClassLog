package org.example.backend.domain.lectureNote.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lectureNote.converter.LectureNoteConverter;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.service.LectureNoteService;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/lectures/{class_id}/note")
@RequiredArgsConstructor
public class LectureNoteController {

    private final LectureNoteService lectureNoteService;

    @PostMapping("/upload")
    public ApiResponse<LectureNoteResponseDTO> uploadLectureNote(
            @PathVariable("class_id") UUID classId,
            @RequestParam("file") MultipartFile file) throws IOException {

        LectureNote lectureNote = lectureNoteService.uploadLectureNote(classId, file);
        LectureNoteResponseDTO responseDTO = LectureNoteConverter.toDTO(lectureNote);

        return ApiResponse.onSuccess(responseDTO);
    }
}

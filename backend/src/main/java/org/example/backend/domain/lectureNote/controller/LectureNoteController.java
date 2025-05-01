package org.example.backend.domain.lectureNote.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lectureNote.converter.LectureNoteConverter;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteKeyResponseDTO;
import org.example.backend.domain.lectureNote.dto.response.LectureNoteResponseDTO;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.service.LectureNoteService;
import org.example.backend.domain.lectureNote.service.LectureNoteServiceImpl;
import org.example.backend.global.ApiResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureNoteController {

    private final LectureNoteService lectureNoteService;


    //강의록 업로드
    @PostMapping("/{class_id}/note/upload")
    public ApiResponse<LectureNoteKeyResponseDTO> uploadLectureNote(
            @PathVariable("class_id") UUID classId,
            @RequestParam("file") MultipartFile file) throws IOException {

        LectureNote lectureNote = lectureNoteService.uploadLectureNote(classId, file);
        LectureNoteKeyResponseDTO responseDTO = LectureNoteConverter.toDTO(lectureNote);

        return ApiResponse.onSuccess(responseDTO);
    }

    //강의록 삭제
    @DeleteMapping("/{lecture_note_id}/notes")
    public ApiResponse<String> deleteLectureNote(
            @PathVariable("lecture_note_id") UUID lectureNoteId) throws IOException {

        lectureNoteService.deleteLectureNote(lectureNoteId);

        return ApiResponse.onSuccess("LectureNote deleted.");
    }
    @GetMapping("/{lecture_note_id}")
    public ApiResponse<LectureNoteResponseDTO> getLectureNote(
            @PathVariable("lecture_note_id") UUID lectureNoteId) {

        // 서비스에서 presigned URL 포함된 DTO 받아오기
        LectureNoteResponseDTO response = lectureNoteService.getLectureNoteDetail(lectureNoteId);

        return ApiResponse.onSuccess(response);
    }

    @GetMapping("/{class_id}/notes")
    public ApiResponse<List<LectureNoteKeyResponseDTO>> getLectureNotes(
            @PathVariable("class_id") UUID classId) {
                List<LectureNoteKeyResponseDTO> response = lectureNoteService.getLectureNoteList(classId);
                return ApiResponse.onSuccess(response);
    }



}

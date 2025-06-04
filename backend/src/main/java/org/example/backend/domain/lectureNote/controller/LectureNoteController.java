package org.example.backend.domain.lectureNote.controller;

import lombok.RequiredArgsConstructor;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureNoteController {

    private final LectureNoteService lectureNoteService;


    @PostMapping("/{class_id}/note/upload")
    public ApiResponse<String> uploadLectureNote(
            @PathVariable("class_id") UUID classId,
            @RequestParam("file") List<MultipartFile> files) throws IOException {
        List<LectureNote> lectureNotes = lectureNoteService.uploadLectureNotes(classId, files);


        return ApiResponse.onSuccess("저장 성공");
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

    //클래스 별 강의록 조회
    @GetMapping("/{class_id}/class/notes")
    public ApiResponse<List<LectureNoteKeyResponseDTO>> getLectureNotes(
            @PathVariable("class_id") UUID classId) {
                List<LectureNoteKeyResponseDTO> response = lectureNoteService.getLectureNoteList(classId);
                return ApiResponse.onSuccess(response);
    }

    //강의 별 강의록 조회
    @GetMapping("/{lecture_id}/lecture/notes")
    public ApiResponse<List<LectureNoteResponseDTO>> getLectureNotesByLectureId(
            @PathVariable("lecture_id") UUID lectureId) {
        List<LectureNoteResponseDTO> response = lectureNoteService.getLectureNoteListByLecture(lectureId);
        return ApiResponse.onSuccess(response);
    }



}

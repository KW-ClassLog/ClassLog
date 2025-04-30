package org.example.backend.domain.quiz.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.domain.lecture.entity.Lecture;
import org.example.backend.domain.lecture.repository.LectureRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.domain.lectureNoteMapping.entity.LectureNoteMapping;
import org.example.backend.domain.lectureNoteMapping.repository.LectureNoteMappingRepository;
import org.example.backend.domain.quiz.dto.request.QuizRequestDTO;
import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;
import org.example.backend.domain.quiz.exception.QuizErrorCode;
import org.example.backend.domain.quiz.exception.QuizException;
import org.example.backend.infra.langchain.LangChainClient;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final LectureRepository lectureRepository;
//    private final LectureNoteMappingRepository lectureNoteMappingRepository;
//    private final LectureNoteRepository lectureNoteRepository;
    private final LangChainClient langChainClient;

    @Override
    public QuizResponseDTO generateQuiz(UUID lectureId, QuizRequestDTO request) {
        // 1. 강의 존재 여부 확인
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new QuizException(QuizErrorCode.LectureNotFound));

        // 2. 강의록 매핑 존재 여부 확인
//        Optional<LectureNoteMapping> mappingOpt = lectureNoteMappingRepository.findFirstByLectureId(lectureId);
//        if (mappingOpt.isEmpty()) {
//            throw new QuizException(QuizErrorCode.LectureNoteNotFound);
//        }
//
//        UUID noteId = mappingOpt.get().getLectureNoteId();
//        LectureNote note = lectureNoteRepository.findById(noteId)
//                .orElseThrow(() -> new QuizException(QuizErrorCode.LectureNoteNotFound));

        try {
            // 3. LangChain 서버 호출
            return langChainClient.requestQuiz(
                    lectureId.toString(),
                    note.getNoteUrl(),
                    request.isUseAudio(),
                    lecture.getAudioUrl()
            );
        } catch (Exception e) {
            throw new QuizException(QuizErrorCode.AiCallFailed);
        }
    }
}
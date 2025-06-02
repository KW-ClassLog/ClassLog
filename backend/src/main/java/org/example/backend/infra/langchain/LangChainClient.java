package org.example.backend.infra.langchain;

import org.example.backend.domain.quiz.dto.response.QuizResponseDTO;

public interface LangChainClient {
    QuizResponseDTO requestQuiz(String lectureId, String documentUrl, boolean useAudio, String audioUrl, boolean isRegenerate);
}
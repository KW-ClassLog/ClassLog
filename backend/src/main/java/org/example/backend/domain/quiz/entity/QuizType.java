package org.example.backend.domain.quiz.entity;

public enum QuizType {
    MULTIPLE_CHOICE, // 객관식
    SHORT_ANSWER,    // 주관식
    TRUE_FALSE;       // OX 문제 (True/False)

    public static QuizType from(String raw) {
        return switch (raw.toLowerCase().replace(" ", "").replace("-", "")) {
            case "multiplechoice" -> MULTIPLE_CHOICE;
            case "shortanswer" -> SHORT_ANSWER;
            case "truefalse" -> TRUE_FALSE;
            default -> throw new IllegalArgumentException("Invalid quiz type: " + raw);
        };
    }
}

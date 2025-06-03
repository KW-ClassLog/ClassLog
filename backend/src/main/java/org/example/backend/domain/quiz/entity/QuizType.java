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

    public static String toCamelCase(String enumName) {
        String[] parts = enumName.toLowerCase().split("_");
        if (parts.length == 1) return parts[0];
        return parts[0] + Character.toUpperCase(parts[1].charAt(0)) + parts[1].substring(1);
    }
}

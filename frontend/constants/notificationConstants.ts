export const NOTIFICATION_TYPES = {
  quizUpload: {
    comment: "차시 퀴즈가 업로드되었습니다.",
    student: {
      redirectPage: "/student/lecture-detail/",
      activeTab: "복습 퀴즈",
    },
  },
  quizAnswerUpload: {
    comment: "차시 퀴즈가 결과 공개되었습니다.",
    student: {
      redirectPage: "/student/lecture-detail/",
      activeTab: "복습 퀴즈",
    },
    teacher: { redirectPage: "/teacher/quiz-dashboard/" },
  },
  lectureNoteUpload: {
    comment: "새 강의자료가 업로드되었습니다.",
    student: {
      redirectPage: "/student/class-detail/",
      activeTab: "강의자료",
    },
  },
  startLecture: {
    comment: "차시 강의가 시작되었습니다. 질문을 남겨주세요.",
    student: {
      redirectPage: "/student/lecture-detail/",
      activeTab: "질문하기",
    },
  },
  recordUpload: {
    comment: "차시 녹음본이 업로드되었습니다.",
    student: {
      redirectPage: "/student/lecture-detail/",
      activeTab: "강의 녹음",
    },
  },
};

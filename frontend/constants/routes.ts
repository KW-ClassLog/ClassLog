export const ROUTES = {
  // 공통 경로
  landing: "/",
  login: "/login",
  signup: "/signup",

  // 학생 관련 경로
  studentHome: "/student", // 학생 홈
  studentClass: "/student/class", // 학생 클래스 목록
  studentClassDetail: (classId: string) => `/student/class-detail/${classId}`, // 학생 클래스 상세
  studentLectureDetail: (lectureId: string) =>
    `/student/lecture-detail/${lectureId}`, // 학생 강의 상세
  studentNotification: "/student/notification", // 학생 알림
  studentProfile: "/student/profile", // 학생 프로필
  studentProfileEdit: "/student/profile/edit", // 학생 프로필 수정
  studentProfileNotificationSetting: "/student/profile/notification-setting", // 학생 프로필 알림 설정

  // 강사 관련 경로
  teacherHome: "/teacher", // 강사 홈
  teacherClassManagement: "/teacher/class-management", // 강사 클래스 관리
  teacherLectureManagement: "/teacher/lecture-management", // 강사 강의 관리
  teacherLectureNoteManagement: "/teacher/lecturenote-management", // 강사 강의 자료 관리
  teacherQuizDashboard: (lectureId: string) =>
    `/teacher/quiz-dashboard/${lectureId}`, // 강사 퀴즈 대시보드
  teacherLectureDetail: (lectureId: string) =>
    `/teacher/lecture-detail/${lectureId}`, // 강사 강의 상세
  teacherSetting: "/teacher/setting", // 강사 설정
  teacherStudentManagement: "/teacher/student-management", // 강사 학생 관리
};

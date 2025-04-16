export enum StudentHeaderType {
  NONE = "NONE", // 헤더 없는 경우
  TITLE = "TITLE", // 타이틀만 있는 헤더
  BACK_WITH_TITLE = "BACK_WITH_TITLE", // 타이틀에 뒤로가기 있는 헤더
  BACK_WITH_PROFILE = "BACK_WITH_PROFILE", // 뒤로가기에 프로필 있는 헤더
}

export enum TeacherHeaderType {
  NONE = "NONE", // 헤더 없는 경우
  DEFAULT = "DEFAULT", // 강사용 기본
  CLASS_SELECTION = "CLASS_SELECTION", // 강사용 클래스 선택
}

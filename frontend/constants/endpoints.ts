const BASE_API = "/api";

export const ENDPOINTS = {
  // 사용자 관련
  USERS: {
    KAKAO_LOGIN: `${BASE_API}/users/kakao`,
    KAKAO_ONBOARDING: `${BASE_API}/users/kakao/onboarding`,
    LOGOUT: `${BASE_API}/users/logout`,
    REFRESH_TOKEN: `${BASE_API}/users/refresh`,
    RESET_PASSWORD: `${BASE_API}/users/password/reset`,
    SIGNUP: `${BASE_API}/users`,
    LOGIN: `${BASE_API}/users/login`,
    VERIFY_EMAIL: `${BASE_API}/users/verify-email`,
    SEND_TEMP_PASSWORD: `${BASE_API}/users/password/temp`,
    DELETE_ACCOUNT: `${BASE_API}/users/me`,
    UPDATE_PROFILE: `${BASE_API}/users/me`,
    GET_MY_INFO: `${BASE_API}/users/me`,

    SET_NICKNAME: `${BASE_API}/users/nickname`,
    GET_NICKNAME: `${BASE_API}/users/nickname`,
    UPDATE_NICKNAME: `${BASE_API}/users/nickname`,

    GET_MY_CLASSES: `${BASE_API}/users/classes`,
    GET_TODAYS_LECTURES: `${BASE_API}/users/today`,
  },

  // 알림 관련
  NOTIFICATIONS: {
    GET_SETTINGS: `${BASE_API}/notifications/setting`,
    UPDATE_SETTINGS: `${BASE_API}/notifications/setting`,
    LIST: `${BASE_API}/notifications`,
    UPDATE_READ_STATUS: `${BASE_API}/notifications`,
  },

  // 클래스 관련
  CLASSES: {
    CREATE: `${BASE_API}/classes/create`,
    UPDATE: (classId: string) => `${BASE_API}/classes/${classId}`,
    GET_DETAIL: (classId: string) => `${BASE_API}/classes/${classId}`,
    DELETE: (classId: string) => `${BASE_API}/classes/${classId}`,

    GET_LECTURES: (classId: string) =>
      `${BASE_API}/classes/${classId}/lectures`,
    GET_STUDENTS: (classId: string) =>
      `${BASE_API}/classes/${classId}/students`,
    GET_ENTRY_CODE: (classId: string) => `${BASE_API}/classes/${classId}/code`,
    ENTER: (classId: string) => `${BASE_API}/classes/${classId}/enter`,
    GET_ALL_NOTES: (classId: string) => `${BASE_API}/classes/${classId}/notes`,
    GET_MY_CLASSES: `${BASE_API}/classes/teacher/myclass`,
  },

  // 강의 관련
  LECTURES: {
    CREATE: `${BASE_API}/lectures/create`,
    UPDATE: (lectureId: string) => `${BASE_API}/lectures/${lectureId}`,
    GET_DETAIL: (classId: string, lectureId: string) =>
      `${BASE_API}/lectures/${classId}/${lectureId}`,
    DELETE: (lectureId: string) => `${BASE_API}/lectures/${lectureId}`,
    GET_LECTURES_BY_DATE: (date: string) =>
      `${BASE_API}/lectures/teacher/today?date=${date}`,

    // 노트 관련
    UPLOAD_NOTE: (classId: string) =>
      `${BASE_API}/lectures/${classId}/note/upload`,
    SELECT_NOTE: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/notes/mapping`,
    DELETE_NOTE: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/notes`,
    GET_NOTE_DETAIL: (lectureId: string, lectureNoteId: string) =>
      `${BASE_API}/lectures/${lectureId}/${lectureNoteId}`,
    GET_NOTE_LIST: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/notes`,

    // 녹음 관련
    SAVE_RECORDING: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/recordings`,
    GET_RECORDING: (lectureId: string, mode: string) =>
      `${BASE_API}/lectures/${lectureId}/recordings?mode=${mode}`,

    // 채팅 관련
    SAVE_CHAT: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/chating`,
    GET_CHAT: (lectureId: string) =>
      `${BASE_API}/lectures/${lectureId}/chating`,
  },

  // 퀴즈 관련
  QUIZZES: {
    CREATE: (lectureId: string) => `${BASE_API}/quizzes/${lectureId}/create`,
    SAVE: (lectureId: string) => `${BASE_API}/quizzes/${lectureId}`,
    UPDATE: (lectureId: string) => `${BASE_API}/quizzes/${lectureId}`,
    GET: (lectureId: string) => `${BASE_API}/quizzes/${lectureId}`,
    SUBMIT: (lectureId: string) => `${BASE_API}/quizzes/${lectureId}/submit`,
    GET_RESULT: (lectureId: string) =>
      `${BASE_API}/quizzes/${lectureId}/result`,
  },
};

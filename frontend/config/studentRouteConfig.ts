// config/routeConfig.ts - 라우트 설정 타입 및 객체 정의
import { ROUTES } from "@/constants/routes";
import { StudentHeaderType } from "./headerType";
import { NavigationType } from "./navigationType";

// 각 라우트에 대한 설정 타입 정의
export type RouteConfig = {
  path: string | ((id: string) => string); // 경로 또는 경로 생성 함수
  headerType: StudentHeaderType; // 헤더 타입
  title?: string; // 고정 타이틀
  dynamicTitle?: boolean; // 동적 타이틀 여부
  titleKey?: string; // 동적 타이틀을 가져올 데이터 키
  navType: NavigationType; // 네비게이션 타입
};

// 라우트 설정 객체
export const STUDENT_ROUTE_CONFIG: Record<
  keyof Pick<
    typeof ROUTES,
    | "studentHome"
    | "studentClass"
    | "studentClassDetail"
    | "studentLectureDetail"
    | "studentNotification"
    | "studentProfile"
    | "studentProfileEdit"
    | "studentProfileNotificationSetting"
  >,
  RouteConfig
> = {
  studentHome: {
    path: ROUTES.studentHome,
    headerType: StudentHeaderType.NONE,
    navType: NavigationType.DEFAULT,
  },
  studentClass: {
    path: ROUTES.studentClass,
    headerType: StudentHeaderType.TITLE,
    title: "내 클래스",
    navType: NavigationType.DEFAULT,
  },
  studentClassDetail: {
    path: ROUTES.studentClassDetail,
    headerType: StudentHeaderType.BACK_WITH_PROFILE,
    navType: NavigationType.NONE,
  },
  studentLectureDetail: {
    path: ROUTES.studentLectureDetail,
    headerType: StudentHeaderType.BACK_WITH_TITLE,
    dynamicTitle: true,
    titleKey: "className",
    navType: NavigationType.NONE,
  },
  studentNotification: {
    path: ROUTES.studentNotification,
    headerType: StudentHeaderType.TITLE,
    title: "알림",
    navType: NavigationType.DEFAULT,
  },
  studentProfile: {
    path: ROUTES.studentProfile,
    headerType: StudentHeaderType.TITLE,
    title: "프로필",
    navType: NavigationType.DEFAULT,
  },
  studentProfileEdit: {
    path: ROUTES.studentProfileEdit,
    headerType: StudentHeaderType.BACK_WITH_TITLE,
    title: "프로필 수정",
    navType: NavigationType.NONE,
  },
  studentProfileNotificationSetting: {
    path: ROUTES.studentProfileNotificationSetting,
    headerType: StudentHeaderType.BACK_WITH_TITLE,
    title: "알림 설정",
    navType: NavigationType.NONE,
  },
};

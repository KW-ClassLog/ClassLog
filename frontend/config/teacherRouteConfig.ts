// config/routeConfig.ts - 라우트 설정 타입 및 객체 정의
import { ROUTES } from "@/constants/routes";
import { TeacherHeaderType } from "./headerType";
import { SiderbarType } from "./sidebarType";

// 각 라우트에 대한 설정 타입 정의
export type RouteConfig = {
  path: string | ((id: string) => string); // 경로 또는 경로 생성 함수
  headerType: TeacherHeaderType; // 헤더 타입
  sidebarType: SiderbarType; // 네비게이션 타입
};

// 라우트 설정 객체
export const TEACHER_ROUTE_CONFIG: Record<
  keyof Pick<
    typeof ROUTES,
    | "teacherHome"
    | "teacherQuizManagement"
    | "teacherLectureManagement"
    | "teacherLectureNoteManagement"
    | "teacherQuizDashboard"
    | "teacherLectureDetail"
    | "teacherSetting"
    | "teacherStudentManagement"
  >,
  RouteConfig
> = {
  teacherHome: {
    path: ROUTES.teacherHome,
    headerType: TeacherHeaderType.DEFAULT,
    sidebarType: SiderbarType.DEFAULT,
  },
  teacherQuizManagement: {
    path: ROUTES.teacherQuizManagement,
    headerType: TeacherHeaderType.CLASS_SELECTION,
    sidebarType: SiderbarType.DEFAULT,
  },
  teacherLectureManagement: {
    path: ROUTES.teacherLectureManagement,
    headerType: TeacherHeaderType.CLASS_SELECTION,
    sidebarType: SiderbarType.DEFAULT,
  },
  teacherLectureNoteManagement: {
    path: ROUTES.teacherLectureNoteManagement,
    headerType: TeacherHeaderType.CLASS_SELECTION,
    sidebarType: SiderbarType.DEFAULT,
  },
  teacherQuizDashboard: {
    path: ROUTES.teacherQuizDashboard,
    headerType: TeacherHeaderType.NONE,
    sidebarType: SiderbarType.NONE,
  },
  teacherLectureDetail: {
    path: ROUTES.teacherLectureDetail,
    headerType: TeacherHeaderType.NONE,
    sidebarType: SiderbarType.NONE,
  },
  teacherSetting: {
    path: ROUTES.teacherSetting,
    headerType: TeacherHeaderType.NONE,
    sidebarType: SiderbarType.NONE,
  },
  teacherStudentManagement: {
    path: ROUTES.teacherStudentManagement,
    headerType: TeacherHeaderType.CLASS_SELECTION,
    sidebarType: SiderbarType.DEFAULT,
  },
};

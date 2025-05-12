import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./constants/routes";
import { jwtDecode } from "jwt-decode";

// 공통 경로 목록
const PUBLIC_PATHS = [ROUTES.landing, ROUTES.login, ROUTES.signup];

// 학생 관련 경로 목록
const STUDENT_PATHS = [
  ROUTES.studentHome,
  ROUTES.studentClass,
  "/student/class-detail",
  "/student/lecture-detail",
  ROUTES.studentNotification,
  ROUTES.studentProfile,
  ROUTES.studentProfileEdit,
  ROUTES.studentProfileNotificationSetting,
];

// 강사 관련 경로 목록
const TEACHER_PATHS = [
  ROUTES.teacherHome,
  ROUTES.teacherQuizManagement,
  ROUTES.teacherLectureManagement,
  ROUTES.teacherLectureNoteManagement,
  "/teacher/quiz-dashboard",
  "/teacher/lecture-detail",
  ROUTES.teacherSetting,
  ROUTES.teacherStudentManagement,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookies = request.cookies;
  const token = cookies.get("refresh_token")?.value;

  // 토큰이 없는 경우 (로그인하지 않은 사용자)
  if (!token) {
    // 공통 경로는 접근 가능
    if (PUBLIC_PATHS.some((path) => pathname === path)) {
      return NextResponse.next();
    }
    // 그 외 경로는 랜딩 페이지로 리다이렉트
    return NextResponse.redirect(new URL(ROUTES.landing, request.url));
  }

  try {
    interface DecodedToken {
      userId: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    const role = decodedToken.role;
    console.log("token", token);
    console.log("decodedToken", decodedToken);
    console.log("role", role);

    // 1. 공통 경로에 대한 처리
    if (PUBLIC_PATHS.some((path) => pathname === path)) {
      // 로그인한 사용자는 역할에 따라 해당 홈으로 리다이렉트
      if (role === "STUDENT") {
        return NextResponse.redirect(new URL(ROUTES.studentHome, request.url));
      } else if (role === "TEACHER") {
        return NextResponse.redirect(new URL(ROUTES.teacherHome, request.url));
      }
      return NextResponse.next();
    }

    // 2. 학생 관련 경로에 대한 처리
    if (STUDENT_PATHS.some((path) => pathname.startsWith(path))) {
      // 학생만 접근 가능
      if (role === "TEACHER") {
        return NextResponse.redirect(new URL(ROUTES.teacherHome, request.url));
      }
      if (role !== "STUDENT") {
        return NextResponse.redirect(new URL(ROUTES.login, request.url));
      }
      return NextResponse.next();
    }

    // 3. 강사 관련 경로에 대한 처리
    if (TEACHER_PATHS.some((path) => pathname.startsWith(path))) {
      // 강사만 접근 가능
      if (role === "STUDENT") {
        return NextResponse.redirect(new URL(ROUTES.studentHome, request.url));
      }
      if (role !== "TEACHER") {
        return NextResponse.redirect(new URL(ROUTES.login, request.url));
      }
      return NextResponse.next();
    }
  } catch {
    // 토큰 디코딩 실패 시 랜딩 페이지로 리다이렉트
    return NextResponse.redirect(new URL(ROUTES.landing, request.url));
  }

  // 그 외 경로는 접근 허용
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

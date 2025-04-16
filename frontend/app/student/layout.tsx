"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation/Navigation";
import { ROUTES } from "@/constants/routes";
import StudentPageTitleHeader from "@/components/Header/StudentPageTitleHeader/StudentPageTitleHeader";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 네비게이션을 표시할 페이지 경로 목록
  const navigationPages = [
    ROUTES.studentHome,
    ROUTES.studentClass,
    ROUTES.studentNotification,
    ROUTES.studentProfile,
  ];

  const titleHeaderPages = [
    ROUTES.studentClass,
    ROUTES.studentNotification,
    ROUTES.studentProfile,
  ];

  // 각 페이지에 대한 타이틀 설정
  const pageTitles: { [key: string]: string } = {
    [ROUTES.studentClass]: "클래스",
    [ROUTES.studentNotification]: "알림",
    [ROUTES.studentProfile]: "프로필",
    // 추가적인 경로 및 타이틀을 설정할 수 있습니다
  };

  // 네비게이션을 해당 경로에서만 표시
  const showNavigation = navigationPages.includes(pathname);
  const showTitleHeader = titleHeaderPages.includes(pathname);

  const pageTitle = pageTitles[pathname] || "기본 타이틀"; // 기본 타이틀을 설정할 수도 있습니다.

  return (
    <body
      className={`student-body ${showNavigation ? "show-nav" : ""} ${
        showTitleHeader ? "show-header" : ""
      }`}
    >
      {showTitleHeader && <StudentPageTitleHeader title={pageTitle} />}
      {children}
      {showNavigation && <Navigation />}
    </body>
  );
}

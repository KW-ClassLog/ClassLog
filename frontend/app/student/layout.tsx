"use client";
import { usePathname } from "next/navigation";
import { STUDENT_ROUTE_CONFIG } from "@/config/studentRouteConfig";
import { StudentHeaderType } from "@/config/headerType";
import { NavigationType } from "@/config/navigationType";

import BackWithProfileHeader from "@/components/Header/Student/BackWithProfileHeader/BackWithProfileHeader";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";
import TitleHeader from "@/components/Header/Student/TitleHeader/TitleHeader";

import Navigation from "@/components/Navigation/Navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 현재 경로에 해당하는 라우트 설정 찾기
  const currentRoute = Object.values(STUDENT_ROUTE_CONFIG).find((config) => {
    // path가 함수인 경우 (동적 라우트)
    if (typeof config.path === "function") {
      // 패턴 매칭으로 확인 (예: /student/class/123 → /student/class/[id])
      const pathPattern = config.path("[^/]+");
      return new RegExp(`^${pathPattern}$`).test(pathname);
    }
    return config.path === pathname;
  });

  // 헤더 렌더링 함수
  const renderHeader = () => {
    if (!currentRoute) return null;

    switch (currentRoute.headerType) {
      case StudentHeaderType.NONE:
        return null;
      case StudentHeaderType.TITLE:
        return <TitleHeader title={currentRoute.title || ""} />;
      case StudentHeaderType.BACK_WITH_TITLE:
        return <BackWithTitleHeader title={currentRoute.title || ""} />;
      case StudentHeaderType.BACK_WITH_PROFILE:
        return <BackWithProfileHeader />;
      default:
        return null;
    }
  };

  // TODO: dynamicTitle일 경우에는 스토어에 저장된 타이틀 가져와서 적용하는 부분 추후 추가

  // 네비게이션 표시 여부
  const showNavigation = currentRoute?.navType === NavigationType.DEFAULT;

  return (
    <body
      className={`student-body ${showNavigation ? "show-nav" : ""} ${
        currentRoute?.headerType !== StudentHeaderType.NONE ? "show-header" : ""
      }`}
    >
      {renderHeader()}
      <div className="content">{children}</div>
      {showNavigation && <Navigation />}
    </body>
  );
}

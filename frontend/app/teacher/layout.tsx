"use client";
import { usePathname } from "next/navigation";
import { TEACHER_ROUTE_CONFIG } from "@/config/teacherRouteConfig";
import { SiderbarType } from "@/config/sidebarType";

import SideBar from "@/components/SideBar/SideBar";
import { TeacherHeaderType } from "@/config/headerType";
import ClassSelectionHeader from "@/components/Header/Teacher/ClassSelectionHeader/ClassSelectionHeader";
import DefaultHeader from "@/components/Header/Teacher/DefaultHeader/DefaultHeader";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 현재 경로에 해당하는 라우트 설정 찾기
  const currentRoute = Object.values(TEACHER_ROUTE_CONFIG).find((config) => {
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
      case TeacherHeaderType.NONE:
        return null;
      case TeacherHeaderType.DEFAULT:
        return <DefaultHeader />;
      case TeacherHeaderType.CLASS_SELECTION:
        return <ClassSelectionHeader />;
      default:
        return null;
    }
  };

  const showSidebar = currentRoute?.sidebarType === SiderbarType.DEFAULT;

  return (
    <body className={`teacher-body ${showSidebar ? "show-sidebar" : ""}`}>
      {showSidebar && <SideBar />}
      {renderHeader()}
      <div className="content">{children}</div>
    </body>
  );
}

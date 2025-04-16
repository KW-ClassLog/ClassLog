"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation/Navigation";
import { ROUTES } from "@/constants/routes";

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

  // 네비게이션을 해당 경로에서만 표시
  const showNavigation = navigationPages.includes(pathname);
  return (
    <body className={`student-body ${showNavigation ? "show-nav" : ""}`}>
      {children}
      {showNavigation && <Navigation />}
    </body>
  );
}

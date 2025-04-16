"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation/Navigation";
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // 현재 경로

  // 네비게이션을 표시할 페이지 경로 목록
  const navigationPages = [
    "/student", // studentHome
    "/student/class", // studentClass
    "/student/notification", // studentNotification
    "/student/profile", // studentProfile
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

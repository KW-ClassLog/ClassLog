"use client";

import styles from "./DefaultHeader.module.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 사용

const DefaultHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // '설정' 클릭 시 페이지 이동 함수
  const handleSettingsClick = () => {
    router.push(ROUTES.teacherSetting); // teacherSetting 페이지로 이동
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // '설정' 클릭 시 로그아웃  처리
  const handleLogoutClick = () => {};

  return (
    <section className={styles.teacherHeader}>
      <Bell className={styles.icon} />

      <div className={styles.profile} onClick={toggleDropdown}>
        <Image
          src="/images/logo2.png"
          alt="Profile"
          className={styles.profileImage}
          width={50}
          height={50}
        />
        <div className={styles.profileInfo}>
          <span className={styles.name}>손아현</span>
          <span className={styles.university}>광운대학교</span>
        </div>
        <ChevronDown className={styles.icon} />
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <ul>
            <li className={styles.dropdownItem} onClick={handleSettingsClick}>
              <Settings />
              <span>설정</span>
            </li>
            <li className={styles.dropdownItem} onClick={handleLogoutClick}>
              <LogOut />
              <span>로그아웃</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default DefaultHeader;

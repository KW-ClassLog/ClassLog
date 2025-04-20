"use client";

import styles from "./ClassSelectionHeader.module.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 사용

const ClassSelectionHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleClassSelectionOpen, setToggleClassSelectionOpen] =
    useState<boolean>(false);
  const [isClassSelected, setIsClassSelected] = useState<boolean>(false);
  const [classList, setClassList] = useState<string[]>([
    "클래스 1",
    "클래스 2",
    "클래스 3",
  ]);

  // TODO: 스토어에서 클래스 목록 받아와서 setClassList로 저장하기

  // TODO: 유저 아이디 스토어나 로컬스토리지에서 받아와서 하기

  const [selectedClass, setSelectedClass] = useState<string | null>(null); // 선택된 클래스 상태

  const router = useRouter();

  // '설정' 클릭 시 페이지 이동 함수
  const handleSettingsClick = () => {
    router.push(ROUTES.teacherSetting); // teacherSetting 페이지로 이동
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // '로그아웃' 클릭 시 로그아웃 처리
  const handleLogoutClick = () => {};

  // 클래스 선택 처리
  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    setIsClassSelected(true); // 클래스 선택 후 드롭다운 닫기
    setToggleClassSelectionOpen(false);
  };

  return (
    <section className={styles.teacherHeader}>
      <div
        className={`${styles.classSelection} ${
          isClassSelected ? styles.selected : ""
        }`}
        onClick={() => setToggleClassSelectionOpen((prev) => !prev)}
      >
        <span className={styles.classText}>
          {selectedClass || "클래스 선택"}
        </span>
        <ChevronDown className={styles.icon} />
      </div>
      <div className={styles.notificationAndProfile}>
        {" "}
        <Bell className={styles.icon} />
        <div
          className={styles.profile}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
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
        {toggleClassSelectionOpen && (
          <div className={styles.classListDropdown}>
            <ul>
              {classList.map((classItem, index) => (
                <li
                  key={index}
                  className={styles.classListItem}
                  onClick={() => handleClassSelect(classItem)}
                >
                  {classItem}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClassSelectionHeader;

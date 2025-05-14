"use client";

import styles from "./TeacherHeader.module.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 사용
import { logout } from "@/api/users/logout";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import useClassStore from "@/store/useClassStore";

type TeacherHeaderProps = {
  mode: "classSelection" | "default"; // mode에 따라 동작을 달리함
};

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleClassSelectionOpen, setToggleClassSelectionOpen] =
    useState<boolean>(false);
  const [classList, setClassList] = useState<string[]>([
    "클래스 1",
    "클래스 2",
    "클래스 3",
  ]);

  const { selectedClass, setSelectedClass } = useClassStore();
  const router = useRouter();

  // '설정' 클릭 시 페이지 이동 함수
  const handleSettingsClick = () => {
    router.push(ROUTES.teacherSetting); // teacherSetting 페이지로 이동
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // '로그아웃' 클릭 시 로그아웃 처리
  const handleConfirmLogout = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      router.push(ROUTES.landing);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 클래스 선택 처리
  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    setToggleClassSelectionOpen(false);
  };

  return (
    <section
      className={
        mode === "classSelection"
          ? `${styles.teacherHeader}`
          : `${styles.teacherHeader} ${styles.teacherHeaderClassSelection}`
      }
    >
      {mode === "classSelection" && (
        <div
          className={`${styles.classSelection} ${
            selectedClass ? styles.selected : ""
          }`}
          onClick={() => setToggleClassSelectionOpen((prev) => !prev)}
        >
          <span className={styles.classText}>
            {selectedClass || "클래스 선택"}
          </span>
          <ChevronDown className={styles.icon} />
        </div>
      )}

      {toggleClassSelectionOpen && mode === "classSelection" && (
        <div className={styles.classListDropdown}>
          <ul>
            {classList.map((classItem, index) => (
              <li
                key={index}
                className={`${styles.classListItem} ${
                  selectedClass === classItem ? styles.selected : ""
                }`}
                onClick={() => handleClassSelect(classItem)}
              >
                {classItem}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.notificationAndProfile}>
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
      </div>
      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmLogout}
          onClose={handleModalClose}
        >
          정말 로그아웃 하시겠습니까?
        </ConfirmModal>
      )}
    </section>
  );
};

export default TeacherHeader;

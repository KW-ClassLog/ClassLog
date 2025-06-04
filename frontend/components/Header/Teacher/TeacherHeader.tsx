"use client";

import styles from "./TeacherHeader.module.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { logout } from "@/api/users/logout";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import useClassListStore from "@/store/useClassListStore";

type TeacherHeaderProps = {
  mode: "classSelection" | "default";
};

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleClassSelectionOpen, setToggleClassSelectionOpen] =
    useState<boolean>(false);

  const { classList, isLoading, error, fetchClassList } = useClassListStore();
  const { selectedClassId, selectedClassName, setSelectedClass } =
    useSelectedClassStore();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const classListDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const classSelectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClassList();
  }, [fetchClassList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        profileRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        classListDropdownRef.current &&
        classSelectionRef.current &&
        !classListDropdownRef.current.contains(event.target as Node) &&
        !classSelectionRef.current.contains(event.target as Node)
      ) {
        setToggleClassSelectionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    router.push(ROUTES.teacherSetting);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      router.push(ROUTES.landing);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClassSelect = (classId: string, className: string) => {
    setSelectedClass(classId, className);
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
          ref={classSelectionRef}
          className={`${styles.classSelection} ${
            selectedClassId ? styles.selected : ""
          }`}
          onClick={() => setToggleClassSelectionOpen((prev) => !prev)}
        >
          <span className={styles.classText}>
            {selectedClassName || "클래스 선택"}
          </span>
          <ChevronDown className={styles.icon} />
        </div>
      )}

      {toggleClassSelectionOpen && mode === "classSelection" && (
        <div ref={classListDropdownRef} className={styles.classListDropdown}>
          {isLoading ? (
            <div className={styles.loading}>로딩 중...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <ul>
              {classList.map((classItem) => (
                <li
                  key={classItem.classId}
                  className={`${styles.classListItem} ${
                    selectedClassId === classItem.classId ? styles.selected : ""
                  }`}
                  onClick={() =>
                    handleClassSelect(classItem.classId, classItem.className)
                  }
                >
                  {classItem.className}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className={styles.notificationAndProfile}>
        <Bell className={styles.icon} />
        <div
          ref={profileRef}
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
          <div ref={dropdownRef} className={styles.dropdown}>
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

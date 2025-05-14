"use client";

import styles from "./TeacherHeader.module.scss";
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { logout } from "@/api/users/logout";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import useClassStore from "@/store/useClassStore";

interface Class {
  classId: string;
  className: string;
}

type TeacherHeaderProps = {
  mode: "classSelection" | "default";
};

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [toggleClassSelectionOpen, setToggleClassSelectionOpen] =
    useState<boolean>(false);
  const [classList] = useState<Class[]>([
    { classId: "1", className: "클래스 1" },
    { classId: "2", className: "클래스 2" },
    { classId: "3", className: "클래스 3" },
  ]);

  const { selectedClassId, selectedClassName, setSelectedClass } =
    useClassStore();
  const router = useRouter();

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
        <div className={styles.classListDropdown}>
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

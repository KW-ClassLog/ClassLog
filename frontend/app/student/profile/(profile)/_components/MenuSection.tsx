"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../page.module.scss";
import { logout } from "@/api/users/logout";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function MenuSection() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className={styles.menuSection}>
      <ul>
        <li>
          <Link href="#">알림 설정</Link>
          {/* TODO: 추후 실제 알림설정 경로명으로 수정 */}
        </li>
        <li>
          <button onClick={handleLogoutClick} className={styles.logoutButton}>
            로그아웃
          </button>
        </li>
      </ul>

      {/* ConfirmModal for logout */}
      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmLogout}
          onClose={handleModalClose}
        >
          정말 로그아웃 하시겠습니까?
        </ConfirmModal>
      )}
    </div>
  );
}

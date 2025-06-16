"use client";
import React, { useState } from "react";
import { ArrowLeft, Trash2, PencilLine } from "lucide-react";
import styles from "./BackButtonHeader.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";

export default function BackButtonHeader() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: 실제 삭제 로직 구현
    console.log("강의 삭제 실행");
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <header className={styles.quizHeader}>
        <IconButton
          icon={<ArrowLeft />}
          onClick={() => router.push(ROUTES.teacherLectureManagement)}
          ariaLabel={"뒤로가기"}
        ></IconButton>
        <div className={styles.buttonContainer}>
          <IconButton
            icon={<PencilLine />}
            onClick={() => {}}
            ariaLabel={"수정"}
          ></IconButton>
          <IconButton
            icon={<Trash2 />}
            onClick={handleDeleteClick}
            ariaLabel={"삭제"}
          ></IconButton>
        </div>
      </header>

      {showDeleteModal && (
        <ConfirmModal
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteCancel}
        >
          정말 이 강의를 삭제하시겠습니까?
        </ConfirmModal>
      )}
    </>
  );
}

"use client";
import React, { useState } from "react";
import { ArrowLeft, Trash2, PencilLine } from "lucide-react";
import styles from "./BackButtonHeader.module.scss";
import IconButton from "@/components/Button/IconButton/IconButton";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { deleteLecture } from "@/api/lectures/deleteLecture";

export default function BackButtonHeader({ lectureId }: { lectureId: string }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLecture(lectureId);

      if (response.isSuccess) {
        setAlertMessage("강의가 성공적으로 삭제되었습니다.");
        setIsSuccess(true);
      } else {
        setAlertMessage(response.message || "강의 삭제에 실패했습니다.");
        setIsSuccess(false);
      }

      setShowDeleteModal(false);
      setShowAlertModal(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("강의 삭제 중 오류가 발생했습니다.");
      setIsSuccess(false);
      setShowDeleteModal(false);
      setShowAlertModal(true);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleAlertClose = () => {
    setShowAlertModal(false);
    if (isSuccess) {
      router.push(ROUTES.teacherLectureManagement);
    }
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

      {showAlertModal && (
        <AlertModal onClose={handleAlertClose}>{alertMessage}</AlertModal>
      )}
    </>
  );
}

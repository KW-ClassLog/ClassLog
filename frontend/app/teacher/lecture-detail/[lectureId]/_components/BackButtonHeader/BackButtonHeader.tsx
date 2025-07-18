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
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import CreateLectureModal from "@/app/teacher/lecture-management/_components/CreateLectureModal/CreateLectureModal";
import { fetchLectureDetail } from "@/api/lectures/fetchLectureDetail";

export default function BackButtonHeader({
  lectureId,
  onEditComplete,
}: {
  lectureId: string;
  onEditComplete?: () => void;
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<null | {
    lectureId: string;
    classId: string;
    lectureName: string;
    lectureDate: string;
    startTime: string;
    endTime: string;
  }>(null);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = async () => {
    const res = await fetchLectureDetail(lectureId);
    if (res.isSuccess && res.result) {
      setEditModalData({
        lectureId: res.result.lectureId,
        classId: res.result.classId,
        lectureName: res.result.lectureName,
        lectureDate: res.result.lectureDate,
        startTime: res.result.startTime,
        endTime: res.result.endTime,
      });
      setEditModalOpen(true);
    } else {
      setAlertMessage(res.message || "강의 정보를 불러오지 못했습니다.");
      setShowAlertModal(true);
    }
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

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditModalData(null);
    if (onEditComplete) onEditComplete();
    router.refresh?.();
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
            onClick={handleEditClick}
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

      {editModalOpen && editModalData && (
        <ClosableModal onClose={handleEditModalClose}>
          <CreateLectureModal
            onClose={handleEditModalClose}
            mode="edit"
            initialData={editModalData}
          />
        </ClosableModal>
      )}

      {showAlertModal && (
        <AlertModal onClose={handleAlertClose}>{alertMessage}</AlertModal>
      )}
    </>
  );
}

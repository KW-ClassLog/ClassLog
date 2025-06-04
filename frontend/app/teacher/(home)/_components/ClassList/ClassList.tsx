"use client";

import styles from "./ClassList.module.scss";
import { MoreVertical, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import CreateClassModal from "./CreateClassModal/CreateClassModal";
import ClosableModal from "@/components/Modal/ClosableModal/ClosableModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import NoDataView from "@/components/NoDataView/NoDataView";
import { School, PencilLine, Trash2 } from "lucide-react";
import { deleteClass } from "@/api/classes/deleteClass";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import useClassListStore from "@/store/useClassListStore";

export default function ClassList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { classList, isLoading, error, fetchClassList } = useClassListStore();

  useEffect(() => {
    fetchClassList();
  }, [fetchClassList]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleMoreClick = (classId: string) => {
    setDropdownOpenId((prev) => (prev === classId ? null : classId));
  };

  const handleEdit = (classId: string) => {
    setDropdownOpenId(null);
    setAlert(`수정: ${classId}`);
  };

  const handleDelete = async (classId: string) => {
    setDropdownOpenId(null);
    setConfirmDeleteId(classId);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const res = await deleteClass(confirmDeleteId);
    if (res && res.isSuccess) {
      setAlert("클래스가 성공적으로 삭제되었습니다.");
    } else {
      setAlert(res?.message || "클래스를 삭제하지 못했습니다.");
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <h2 className={styles.mainTitle}>내 클래스 목록</h2>
        <button className={styles.addButton} onClick={handleOpenModal}>
          + 클래스 생성하기
        </button>
      </div>
      <div className={styles.classList}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div>{error}</div>
        ) : classList.length === 0 ? (
          <NoDataView
            icon={School}
            title={"클래스 없음"}
            description={"생성된 클래스가 없습니다."}
          />
        ) : (
          classList.map((classItem) => (
            <div
              key={classItem.classId}
              className={styles.classCard}
              style={{ position: "relative" }}
            >
              <div className={styles.header}>
                <h3 className={styles.title}>{classItem.className}</h3>
                <button
                  className={styles.moreButton}
                  onClick={() => handleMoreClick(classItem.classId)}
                  type="button"
                >
                  <MoreVertical size={20} />
                </button>
                {dropdownOpenId === classItem.classId && (
                  <div className={styles.dropdownMenu}>
                    <button onClick={() => handleEdit(classItem.classId)}>
                      <PencilLine size={16} />
                      <span>수정하기</span>
                    </button>
                    <button onClick={() => handleDelete(classItem.classId)}>
                      <Trash2 size={16} />
                      <span>삭제하기</span>
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <Clock className={styles.icon} size={16} />
                  <span className={styles.infoText}>{classItem.classDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <Calendar className={styles.icon} size={16} />
                  <span className={styles.infoText}>
                    {classItem.startDate} ~ {classItem.endDate}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ClosableModal onClose={handleCloseModal}>
          <CreateClassModal onClose={handleCloseModal} />
        </ClosableModal>
      )}

      {confirmDeleteId && (
        <ConfirmModal
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={handleConfirmDelete}
        >
          정말로 클래스를 삭제하시겠습니까?
        </ConfirmModal>
      )}
      {alert && <AlertModal onClose={() => setAlert(null)}>{alert}</AlertModal>}
    </div>
  );
}

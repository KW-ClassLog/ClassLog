"use client";

import styles from "./LectureMaterials.module.scss";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import FileSelectModal from "@/components/Modal/FileSelectModal/FileSelectModal";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLectureNoteByLectureId } from "@/api/lectures/fetchLectureNoteByLectureId";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";
import { useLectureDetail } from "../LectureDetailContext";

export default function LectureMaterials() {
  const { lectureId, classId } = useLectureDetail();
  const [lectureNotes, setLectureNotes] = useState<
    FetchLectureNoteByLectureIdResult[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLectureNotes = async () => {
      try {
        setLoading(true);
        const response = await fetchLectureNoteByLectureId(lectureId);

        if (response.isSuccess && response.result) {
          setLectureNotes(response.result);
        } else {
          console.error("강의자료 조회 실패:", response.message);
          setLectureNotes([]);
        }
      } catch (error) {
        console.error("강의자료 조회 중 오류 발생:", error);
        setLectureNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureNotes();
  }, [lectureId]);

  const handleAddMaterials = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>강의자료</h2>
      <div className={styles.addButton} onClick={handleAddMaterials}>
        <Plus size={16} />
        강의자료 선택하기
      </div>
      <div className={styles.materialList}>
        {lectureNotes.length === 0 ? (
          <div className={styles.emptyState}>등록된 강의자료가 없습니다.</div>
        ) : (
          lectureNotes.map((note) => (
            <div key={note.lectureNoteId} className={styles.materialItem}>
              <FileDisplay fileName={note.lectureNoteName} />
              <span className={styles.size}>{note.fileSize}</span>
            </div>
          ))
        )}
      </div>

      {isModalOpen && classId && (
        <FileSelectModal classId={classId} onClose={handleModalClose} />
      )}
    </div>
  );
}

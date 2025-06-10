"use client";

import styles from "./LectureMaterials.module.scss";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import FileSelectModal from "@/components/Modal/FileSelectModal/FileSelectModal";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface LectureNote {
  lectureNoteId: string;
  classId: string;
  lectureNoteName: string;
  lectureNoteUrl: string;
  fileSize: string;
}

interface LectureMaterialsProps {
  lectureId: string;
}

export default function LectureMaterials({ lectureId }: LectureMaterialsProps) {
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // TODO: API 호출로 변경
    setLectureNotes([
      {
        lectureNoteId: "f03f87dd-06df-49e6-bc37-e1b1b2d3418f",
        classId: "8ace8481-386f-4d9f-8109-538fa9d760fa",
        lectureNoteName: "안녕.pdf",
        lectureNoteUrl:
          "https://kwclasslog.s3.ap-southeast-2.amazonaws.com/lecture_note/8ace8481-386f-4d9f-8109-538fa9d760fa/b8a71524-bcb8-4d8a-82ab-c5842a59b3c1/%EB%AC%B8%EC%9E%A5%EA%B5%90%EC%A0%95.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250526T142132Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAYQXMWY42KINNIPHG%2F20250526%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Signature=73165b63d4b56c4f061f27e174ae8c10ba77e7184026d6a7a565c11bb0b7abf5",
        fileSize: "0.17 MB",
      },
      {
        lectureNoteId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        classId: "8ace8481-386f-4d9f-8109-538fa9d760fa",
        lectureNoteName: "강의자료.pptx",
        lectureNoteUrl: "https://example.com/lecture_materials/slide.pptx",
        fileSize: "2.5 MB",
      },
      {
        lectureNoteId: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
        classId: "8ace8481-386f-4d9f-8109-538fa9d760fa",
        lectureNoteName: "실습가이드.docx",
        lectureNoteUrl: "https://example.com/lecture_materials/guide.docx",
        fileSize: "1.8 MB",
      },
    ]);
    setLoading(false);
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

      {isModalOpen && (
        <FileSelectModal
          classId={lectureNotes[0]?.classId || ""}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

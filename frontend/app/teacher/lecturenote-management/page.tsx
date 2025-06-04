"use client";
import ManagementTable from "@/components/ManagementTable/ManagementTable";
import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import NoDataView from "@/components/NoDataView/NoDataView";
import { FileText } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { uploadLectureNote } from "@/api/lectures/uploadLectureNote";
import { fetchLectureNotesByClass } from "@/api/lectures/fetchLectureNotesByClass";
import { FetchLectureNotesByClassResult } from "@/types/lectures/fetchLectureNotesByClassTypes";

export default function TeacherLectureNoteManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [alert, setAlert] = useState<string | null>(null);
  const [lectureNotes, setLectureNotes] = useState<
    FetchLectureNotesByClassResult[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 강의자료 목록 불러오기
  const loadLectureNotes = async (classId: string) => {
    const response = await fetchLectureNotesByClass(classId);
    if (response.isSuccess && response.result) {
      setLectureNotes(response.result);
    } else {
      setLectureNotes([]);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      loadLectureNotes(selectedClassId);
    }
  }, [selectedClassId]);

  const handleDelete = (selectedIds: string[]) => {
    const updatedLectureNotes = lectureNotes.filter(
      (note) => !selectedIds.includes(note.lectureNoteId)
    );
    setLectureNotes(updatedLectureNotes);
    // 실제 삭제 API 연동 필요
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!selectedClassId) {
      setAlert("클래스를 선택해주세요.");
      return;
    }

    // 파일 유효성 검사
    const maxSize = 50 * 1024 * 1024;
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        setAlert(`파일 ${file.name}의 크기가 50MB를 초과합니다.`);
        return;
      }
      validFiles.push(file);
    }

    try {
      const response = await uploadLectureNote(selectedClassId, validFiles);
      if (response.isSuccess) {
        setAlert(
          `총 ${validFiles.length}개의 강의자료가 클래스에 업로드 되었습니다.`
        );
        await loadLectureNotes(selectedClassId); // 업로드 성공 시 목록 새로고침
      } else {
        setAlert(response.message || "강의자료 업로드에 실패했습니다.");
      }
    } catch {
      setAlert("강의자료 업로드 중 오류가 발생했습니다.");
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!selectedClassId || !selectedClassName) {
    return (
      <div className={styles.container}>
        <h1>퀴즈 관리</h1>
        <NoDataView
          icon={FileText}
          title="선택된 클래스가 없습니다"
          description="좌상단의 클래스 선택 메뉴에서 클래스를 선택해주세요"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>[{selectedClassName}] 강의자료 관리</h1>
      <div className={styles.addButtonContainer}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          multiple
        />
        <button className={styles.addButton} onClick={handleAddButtonClick}>
          + 강의자료 추가하기
        </button>
      </div>
      <div className={styles.lectureNoteListContainer}>
        <ManagementTable
          type="lectureNote"
          data={lectureNotes}
          onDelete={handleDelete}
        />
      </div>
      {alert && <AlertModal onClose={() => setAlert(null)}>{alert}</AlertModal>}
    </div>
  );
}

"use client";
import ManagementTable from "@/components/ManagementTable/ManagementTable";
import styles from "./page.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import NoDataView from "@/components/NoDataView/NoDataView";
import { FileText } from "lucide-react";
import { useRef, useState } from "react";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";

export default function TeacherLectureNoteManagementPage() {
  const { selectedClassId, selectedClassName } = useSelectedClassStore();
  const [alert, setAlert] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lectureNotes = [
    {
      lectureNoteId: "note1",
      lectureId: "lec1",
      session: [1],
      lectureNoteUrl: "Proposal.docx",
      fileSize: "2.9 MB",
    },
    {
      lectureNoteId: "note2",
      lectureId: "lec1",
      session: [1, 2],
      lectureNoteUrl: "Proposal.docx",
      fileSize: "2.9 MB",
    },
    // Additional data...
  ];

  const handleDelete = (selectedIds: string[]) => {
    const updatedLectureNotes = lectureNotes.filter(
      (note) => !selectedIds.includes(note.lectureNoteId)
    );
    console.log("Updated Lecture Notes:", updatedLectureNotes);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!selectedClassId) {
      setAlert("클래스를 선택해주세요.");
      return;
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setAlert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    // 파일 형식 검사
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAlert(
        "지원하지 않는 파일 형식입니다. (지원 형식: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)"
      );
      return;
    }

    try {
      // TODO: API 연동
      // const formData = new FormData();
      // formData.append("file", file);
      // formData.append("classId", selectedClassId);

      // const response = await createLectureNote(formData);

      // if (response.isSuccess) {
      //   // 성공 처리
      // } else {
      //   setAlert(response.message || "강의자료 업로드에 실패했습니다.");
      // }

      console.log("Selected file:", file);
    } catch (error) {
      console.error("Failed to upload lecture note:", error);
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
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
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

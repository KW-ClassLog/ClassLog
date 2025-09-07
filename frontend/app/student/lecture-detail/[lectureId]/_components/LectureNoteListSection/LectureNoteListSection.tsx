import { fetchLectureNoteByLectureId } from "@/api/lectures/fetchLectureNoteByLectureId";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./LectureNoteListSection.module.scss";
import NoDataView from "@/components/NoDataView/NoDataView";
import { Download, FileText } from "lucide-react";
import IconButton from "@/components/Button/IconButton/IconButton";

interface LectureNoteListSectionProps {
  lectureId: string;
}

export default function LectureNoteListSection({
  lectureId,
}: LectureNoteListSectionProps) {
  const [lectureNotes, setLectureNotes] = useState<
    FetchLectureNoteByLectureIdResult[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchLectureNotes = useCallback(async () => {
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
  }, [lectureId]);

  const handleDownload = async (note: FetchLectureNoteByLectureIdResult) => {
    if (!note.lectureNoteUrl) return;

    try {
      const response = await fetch(note.lectureNoteUrl);
      if (!response.ok) {
        throw new Error("다운로드에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = note.lectureNoteName || "강의자료";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchLectureNotes();
  }, [lectureId, fetchLectureNotes]);

  if (loading) return <LoadingSpinner text="강의자료를 불러오는 중..." />;

  return (
    <div className={styles.materialList}>
      {lectureNotes.length === 0 ? (
        <NoDataView
          icon={FileText}
          title="등록된 강의자료가 없습니다."
          description=""
        />
      ) : (
        lectureNotes.map((note) => (
          <div key={note.lectureNoteId} className={styles.materialItem}>
            <div>
              <FileDisplay
                fileName={note.lectureNoteName}
                size={note.fileSize}
              />
            </div>
            <IconButton
              icon={<Download />}
              onClick={() => handleDownload(note)}
              ariaLabel={"강의자료 다운로드"}
            />
          </div>
        ))
      )}
    </div>
  );
}

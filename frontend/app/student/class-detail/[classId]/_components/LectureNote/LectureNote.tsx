import React, { useEffect, useState } from "react";
import styles from "./LectureNote.module.scss";
import { useParams } from "next/navigation";
import { fetchLectureNotesByClass } from "@/api/lectures/fetchLectureNotesByClass";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import IconButton from "@/components/Button/IconButton/IconButton";
import { Download } from "lucide-react";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";
import { downloadFileWithErrorHandling } from "@/utils/downloadUtils";

interface LectureNote {
  lectureNoteId: string;
  classId: string;
  lectureNoteUrl: string;
  lectureNoteName: string;
  fileSize: string;
  session: number[];
}

export default function LectureNote() {
  const { classId } = useParams();
  const [lectureNotes, setLectureNotes] = useState<LectureNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectureNote = async () => {
      try {
        setLoading(true);
        const response = await fetchLectureNotesByClass(classId as string);
        if (response.isSuccess && response.result) {
          setLectureNotes(response.result);
        }
      } catch (error) {
        console.error("강의 자료를 불러오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectureNote();
  }, [classId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner text="강의 자료를 불러오는 중..." />
      </div>
    );
  }

  const handleDownload = async (note: FetchLectureNoteByLectureIdResult) => {
    await downloadFileWithErrorHandling(
      note.lectureNoteUrl,
      note.lectureNoteName || "강의자료"
    );
  };

  return (
    <div className={styles.container}>
      {lectureNotes.length > 0 ? (
        <div className={styles.fileList}>
          {lectureNotes.map((note) => (
            <div key={note.lectureNoteId} className={styles.fileItem}>
              <FileDisplay
                fileName={note.lectureNoteName}
                size={note.fileSize}
              />
              <IconButton
                icon={<Download />}
                onClick={() => handleDownload(note)}
                ariaLabel={"강의자료 다운로드"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noData}>등록된 강의 자료가 없습니다.</div>
      )}
    </div>
  );
}

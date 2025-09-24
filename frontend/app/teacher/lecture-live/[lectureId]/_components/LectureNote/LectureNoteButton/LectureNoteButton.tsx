"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import IconButton from "@/components/Button/IconButton/IconButton";
import ToolPopover from "../../ToolPopover/ToolPopover";
import LectureNotePopover from "../LectureNotePopover/LectureNotePopover";
import FileSelectModal from "@/components/Modal/FileSelectModal/FileSelectModal";
import { FileText } from "lucide-react";
import { fetchLectureNoteByLectureId } from "@/api/lectures/fetchLectureNoteByLectureId";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";
import styles from "./LectureNoteButton.module.scss";

export default function LectureNoteButton() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const docBtnRef = useRef<HTMLSpanElement>(null);

  const [openDoc, setOpenDoc] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const [lectureNotes, setLectureNotes] = useState<FetchLectureNoteByLectureIdResult[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("class-storage");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setClassId(parsed.state?.selectedClassId ?? null);
      } catch (err) {
        console.error("class-storage 파싱 실패:", err);
      }
    }
  }, []);

  const fetchLectureNotes = async () => {
    try {
      const response = await fetchLectureNoteByLectureId(lectureId);
      if (response.isSuccess && response.result) {
        setLectureNotes(response.result);
      } else {
        setLectureNotes([]);
        console.error("강의자료 조회 실패:", response.message);
      }
    } catch (err) {
      console.error("강의자료 조회 오류:", err);
      setLectureNotes([]);
    }
  };

  useEffect(() => {
    if (lectureId) fetchLectureNotes();
  }, [lectureId]);

  return (
    <>
      <span ref={docBtnRef} className={styles.docBtnZ}>
        <IconButton
          ariaLabel="문서 불러오기"
          onClick={() => setOpenDoc((v) => !v)}
          icon={<FileText />}
        />
      </span>

      <ToolPopover
        open={openDoc}
        anchorRef={docBtnRef}
        onClose={() => setOpenDoc(false)}
        align="start"
        side="bottom"
      >
        <LectureNotePopover
            notes={lectureNotes} 
            onPicked={() => setOpenDoc(false)}
            onUploadRequest={() => setUploadOpen(true)}
        />
      </ToolPopover>

      {uploadOpen && classId && (
        <FileSelectModal
          classId={classId}
          lectureId={lectureId}
          onClose={() => setUploadOpen(false)}
          registeredFiles={lectureNotes.map((n) => n.lectureNoteName)}
          onComplete={() => {
            fetchLectureNotes();
            setUploadOpen(false);
          }}
        />
      )}
    </>
  );
}
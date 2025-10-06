"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import IconButton from "@/components/Button/IconButton/IconButton";
import ToolPopover from "../../ToolPopover/ToolPopover";
import LectureNotePopover from "../LectureNotePopover/LectureNotePopover";
import FileSelectModal from "@/components/Modal/FileSelectModal/FileSelectModal";
import { FileText } from "lucide-react";
import { fetchLectureNoteByLectureId } from "@/api/lectures/fetchLectureNoteByLectureId";
import { FetchLectureNoteByLectureIdResult } from "@/types/lectures/fetchLectureNoteByLectureIdTypes";
import styles from "./LectureNoteButton.module.scss";
import useSelectedClassStore from "@/store/useSelectedClassStore";

export default function LectureNoteButton() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const docBtnRef = useRef<HTMLSpanElement>(null);

  const [openDoc, setOpenDoc] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lectureNotes, setLectureNotes] = useState<
    FetchLectureNoteByLectureIdResult[]
  >([]);
  const { selectedClassId } = useSelectedClassStore();

  const fetchLectureNotes = useCallback(async () => {
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
  }, [lectureId]);

  useEffect(() => {
    if (lectureId) fetchLectureNotes();
  }, [lectureId, fetchLectureNotes]);

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

      {uploadOpen && selectedClassId && (
        <FileSelectModal
          classId={selectedClassId}
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

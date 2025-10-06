"use client";

import styles from "./LectureNotePopover.module.scss";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import { DocType, useLive } from "../../LectureLiveProvider";
import { useState } from "react";

type Item = { name: string; url: string; type: DocType };

interface Props {
  notes: {
    lectureNoteId: string;
    lectureNoteName: string;
    lectureNoteUrl: string;
    fileSize: string;
  }[];
  onPicked?: () => void;
  onUploadRequest?: () => void;
}

export default function LectureNotePopover({ notes, onPicked, onUploadRequest }: Props) {
  const { setDoc, doc } = useLive();
  const [unsupportedFile, setUnsupportedFile] = useState<string | null>(null);

  const pick = (it: Item) => {
    if (it.type !== "pdf") {
      setUnsupportedFile(it.name);
      return;
    }
    setUnsupportedFile(null);
    setDoc({ url: it.url, type: it.type, name: it.name });
    onPicked?.();
  };

  const handleAddMaterials = () => {
    onUploadRequest?.();
    onPicked?.();
  };

  return (
    <div className={styles.pop}>
      <div className={styles.list}>
        {notes.map((note) => {
          const ext = note.lectureNoteName.toLowerCase().endsWith(".pdf") ? "pdf" : "unknown";
          return (
            <div key={note.lectureNoteId}>
              <button
                type="button"
                onClick={() =>
                  pick({
                    name: note.lectureNoteName,
                    url: note.lectureNoteUrl,
                    type: ext,
                  })
                }
                className={`${styles.row} ${doc?.name === note.lectureNoteName ? styles.active : ""}`}
              >
                <FileDisplay fileName={note.lectureNoteName} />
              </button>
            </div>
          );
        })}
      </div>

      {unsupportedFile && (
        <div className={styles.unsupported}>
          <strong>{unsupportedFile}</strong> 은(는) 지원하지 않습니다.<br />
          PDF 파일만 선택할 수 있습니다.
        </div>
      )}

      <div className={styles.divider} />

      <button type="button" className={styles.uploadBtn} onClick={handleAddMaterials}>
        강의자료 업로드
      </button>
    </div>
  );
}
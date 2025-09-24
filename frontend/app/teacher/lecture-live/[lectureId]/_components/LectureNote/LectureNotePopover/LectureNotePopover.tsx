"use client";

import styles from "./LectureNotePopover.module.scss";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import { useLive } from "../../LectureLiveProvider";

type Item = { name: string; url: string; type: "pdf" | "pptx" };

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

  const pick = (it: Item) => {
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
          const ext = note.lectureNoteName.toLowerCase().endsWith(".pptx") ? "pptx" : "pdf";
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

      <div className={styles.divider} />

      <button type="button" className={styles.uploadBtn} onClick={handleAddMaterials}>
        강의자료 업로드
      </button>
    </div>
  );
}
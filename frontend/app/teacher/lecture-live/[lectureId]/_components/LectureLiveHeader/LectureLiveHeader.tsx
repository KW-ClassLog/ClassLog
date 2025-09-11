"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./LectureLiveHeader.module.scss";
import FitContentButton from "@/components/Button/FitContentButton/FitContentButton";
import IconButton from "@/components/Button/IconButton/IconButton";
import { DocumentSideButtonConnected } from "../DocumentSideButton/DocumentSideButton";
import PenToolButtons from "../PenTool/PenToolButtons/PenToolButtons";
import { useLive } from "../LectureLiveProvider";
import { FileText } from "lucide-react";
import ToolPopover from "../ToolPopover/ToolPopover";
import LectureNotePopover from "../LectureNote/LectureNotePopover/LectureNotePopover";
import ChatingButton from "../Chating/ChatingButton/ChatingButton";
import RecordingButton from "../Recording/RecordingButton/RecordingButton";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import { getRecordingEngine, type RecState } from "../Recording/recordingEngine";
import { ROUTES } from "@/constants/routes";

export default function LectureLiveHeader({
  onToggleChat,
  onEndLecture,
}: {
  onUploadDoc?: () => void;
  onToggleChat?: () => void;
  onToggleAudio?: () => void;
  onEndLecture?: () => void;
}) {
  const { tool, setTool } = useLive();
  const docBtnRef = useRef<HTMLSpanElement>(null);
  const [openDoc, setOpenDoc] = useState(false);

  const [endOpen, setEndOpen] = useState(false);

  const engine = useMemo(() => getRecordingEngine(), []);
  const [recState, setRecState] = useState<RecState>(engine.getSnapshot().state);
  const isRecording = recState === "recording";

  useEffect(() => {
    const off = engine.subscribe("state", setRecState);
    return () => off();
  }, [engine]);

  const selectTool = (t: any) => setTool(t);
  const closePen = () => setTool("pencilOff");

  const handleEndLectureClick = () => {
    closePen();
    setEndOpen(true);
  };

  const router = useRouter();
  const { lectureId } = useParams<{ lectureId: string }>();

  const handleConfirmEnd = async () => {
    if (isRecording) {
      try {
        await engine.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setEndOpen(false);
    onEndLecture?.();

    router.push(ROUTES.teacherLectureDetail(lectureId));
  };

  const handleCancelEnd = () => setEndOpen(false);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <DocumentSideButtonConnected />

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
            <LectureNotePopover onPicked={() => setOpenDoc(false)} />
          </ToolPopover>

          <span className={styles.divider} />
          <PenToolButtons value={tool} onChange={selectTool} />
          <span className={styles.divider} />

          <RecordingButton />

          <ChatingButton
            onPress={() => {
              closePen();
              onToggleChat?.();
            }}
          />
        </div>

        <FitContentButton onClick={handleEndLectureClick}>
          강의 종료
        </FitContentButton>
      </div>

      {endOpen && (
        <ConfirmModal onConfirm={handleConfirmEnd} onClose={handleCancelEnd}>
          {isRecording ? (
            <>
              지금 녹음이 진행 중입니다.
              <br />
              종료하면 현재까지의 녹음이 저장됩니다.
              <br />
              <br />
              종료하시겠습니까?
            </>
          ) : (
            <>강의를 종료하시겠습니까?</>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}
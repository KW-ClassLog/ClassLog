"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import IconButton from "@/components/Button/IconButton/IconButton";
import ToolPopover from "../../ToolPopover/ToolPopover";
import RecordingPopover from "../RecordingPopover/RecordingPopover";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import { AudioLines } from "lucide-react";
import styles from "./RecordingButton.module.scss";
import { getRecordingEngine } from "../recordingEngine";
import { saveAudioFile } from "@/api/lectures/saveAudioFile";
import { useParams } from "next/navigation";

export default function RecordingButton() {
  const engine = useMemo(() => getRecordingEngine(), []);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const { lectureId } = useParams<{ lectureId: string }>();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [isRecording, setIsRecording] = useState(
    engine.getSnapshot().state === "recording"
  );

  useEffect(() => {
    const off = engine.subscribe("state", (s) => setIsRecording(s === "recording"));
    return () => off();
  }, [engine]);

  useEffect(() => {
    const off = engine.subscribe("done", async (blob) => {
      if (!lectureId) return;
  
      try {
        await saveAudioFile(lectureId, blob);
      } catch(e) {
        console.error(e);
      }
    });
    return () => off();
  }, [engine, lectureId]);

  const handleRequestConfirmStop = () => {
    setOpen(false);
    setConfirmOpen(true);
  };

  const confirmStopAndSave = async () => {
    await engine.stop();
    setConfirmOpen(false);
    setOpen(true);
  };

  const cancelConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <span ref={anchorRef} className={styles.wrap}>
      <IconButton
        ariaLabel="녹음"
        onClick={() => setOpen((v) => !v)}
        icon={<AudioLines data-active={open} />}
      />
      {isRecording && !open && <i className={styles.badge} aria-hidden />}

      <ToolPopover
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        align="start"
        side="bottom"
      >
        <RecordingPopover onRequestConfirmStop={handleRequestConfirmStop} />
      </ToolPopover>

      {confirmOpen && (
        <ConfirmModal onConfirm={confirmStopAndSave} onClose={cancelConfirm}>
          확인 버튼을 누르면
          <br />
          이 강의의 녹음은 저장됩니다.
          <br />
          <br />
          종료하시겠습니까?
        </ConfirmModal>
      )}
    </span>
  );
}
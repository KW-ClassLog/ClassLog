"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/Modal/ConfirmModal/ConfirmModal";
import cmStyles from "@/components/Modal/ConfirmModal/ConfirmModal.module.scss";
import { getRecordingEngine } from "../recordingEngine";

export default function StartRecordingPrompt() {
  const engine = getRecordingEngine();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const nodes = document.querySelectorAll<HTMLElement>(`.${cmStyles.overlay}`);
      const overlay = nodes[nodes.length - 1];
      if (overlay) {
        overlay.style.zIndex = "2147483647";
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.pointerEvents = "auto";
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const onConfirm = async () => {
    try {
      await engine.start();
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  };

  const onClose = () => setOpen(false);

  if (!open) return null;

  return (
    <ConfirmModal onConfirm={onConfirm} onClose={onClose}>
      강의가 시작되었습니다. 
      <br />
      바로 녹음을 시작할까요?
    </ConfirmModal>
  );
}
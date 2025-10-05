"use client";

import IconButton from "@/components/Button/IconButton/IconButton";
import { PanelLeft, PanelLeftDashed } from "lucide-react";
import { useLive } from "../LectureLiveProvider";

export type DocumentSideButtonProps = {
  open: boolean;
  onToggle: () => void;
  ariaLabelOpen?: string;
  ariaLabelClose?: string;
  disabled?: boolean;
};

export default function DocumentSideButton({
  open,
  onToggle,
  ariaLabelOpen = "슬라이드 패널 열기",
  ariaLabelClose = "슬라이드 패널 닫기",
  disabled = false,
}: DocumentSideButtonProps) {
  const label = open ? ariaLabelClose : ariaLabelOpen;

  return (
    <IconButton
      ariaLabel={label}
      onClick={onToggle}
      disabled={disabled}
      icon={open ? <PanelLeft /> : <PanelLeftDashed />}
    />
  );
}

export function DocumentSideButtonConnected() {
  const { panels, togglePanel } = useLive();
  return (
    <DocumentSideButton
      open={panels.files}
      onToggle={() => togglePanel("files")}
    />
  );
}
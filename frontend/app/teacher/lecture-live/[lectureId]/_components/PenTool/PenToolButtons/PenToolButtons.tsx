"use client";

import { useCallback, useRef, useState } from "react";
import IconButton from "@/components/Button/IconButton/IconButton";
import { Pencil, Eraser, Highlighter, PencilOff } from "lucide-react";
import styles from "./PenToolButtons.module.scss";
import ToolPopover from "../../ToolPopover/ToolPopover";
import PenPopover from "../PenPopover/PenPopover";
import EraserPopover from "../EraserPopover/EraserPopover";
import HighlighterPopover from "../HighlighterPopover/HighlighterPopver";
import { useLive } from "../../LectureLiveProvider";

export type Tool = "pen" | "eraser" | "highlighter" | "pencilOff";

export default function PenToolButtons({
  value,
  onChange,
  className,
  disabled,
}: {
  value: Tool;
  onChange: (tool: Tool) => void;
  className?: string;
  disabled?: boolean;
}) {
  const { pen, setPen, eraser, setEraser, highlighter, setHighlighter } = useLive();

  const penAnchorRef = useRef<HTMLSpanElement>(null);
  const eraserAnchorRef = useRef<HTMLSpanElement>(null);
  const highlighterAnchorRef = useRef<HTMLSpanElement>(null);

  const [openPen, setOpenPen] = useState(false);
  const [openEraser, setOpenEraser] = useState(false);
  const [openHighlighter, setOpenHighlighter] = useState(false);

  const closeAll = () => {
    setOpenPen(false);
    setOpenEraser(false);
    setOpenHighlighter(false);
  };

  const choose = (t: Tool) => {
    onChange(t);
    if (t !== "pen") setOpenPen(false);
    if (t !== "eraser") setOpenEraser(false);
    if (t !== "highlighter") setOpenHighlighter(false);
  };

  const onPenClick = useCallback(() => {
    setOpenEraser(false);
    setOpenHighlighter(false);
    setOpenPen((v) => !v);
    onChange("pen");
  }, [onChange]);

  const onEraserClick = useCallback(() => {
    setOpenPen(false);
    setOpenHighlighter(false);
    setOpenEraser((v) => !v);
    onChange("eraser");
  }, [onChange]);

  const onHighlighterClick = useCallback(() => {
    setOpenPen(false);
    setOpenEraser(false);
    setOpenHighlighter((v) => !v);
    onChange("highlighter");
  }, [onChange]);

  return (
    <div className={`${styles.group} ${className ?? ""}`}>
      <span className={styles.toolWrap} data-active={value === "pen" ? "1" : "0"}>
        <span ref={penAnchorRef} className={styles.anchorWrap}>
          <IconButton
            ariaLabel="펜"
            onClick={onPenClick}
            icon={
              <Pencil
                data-active={value === "pen"}
                style={{ stroke: pen.color, color: pen.color }}
              />
            }
            disabled={disabled}
          />
        </span>
      </span>

      <ToolPopover open={openPen} anchorRef={penAnchorRef} onClose={() => setOpenPen(false)}>
        <PenPopover
          color={pen.color}
          width={pen.size}
          onChangeColor={(c) => setPen({ color: c })}
          onChangeWidth={(w) => setPen({ size: w })}
        />
      </ToolPopover>

      <span className={styles.toolWrap} data-active={value === "eraser" ? "1" : "0"}>
        <span ref={eraserAnchorRef} className={styles.anchorWrap}>
          <IconButton
            ariaLabel="지우개"
            onClick={onEraserClick}
            icon={<Eraser data-active={value === "eraser"} />}
            disabled={disabled}
          />
        </span>
      </span>

      <ToolPopover open={openEraser} anchorRef={eraserAnchorRef} onClose={() => setOpenEraser(false)}>
        <EraserPopover
          width={eraser.size}
          onChangeWidth={(w) => setEraser({ size: w })}
          onClearPage={() => {
            window.dispatchEvent(new CustomEvent("live:clear-page"));
            setOpenEraser(false);
          }}
        />
      </ToolPopover>

      <span className={styles.toolWrap} data-active={value === "highlighter" ? "1" : "0"}>
        <span ref={highlighterAnchorRef} className={styles.anchorWrap}>
          <IconButton
            ariaLabel="형광펜"
            onClick={onHighlighterClick}
            icon={
              <Highlighter
                data-active={value === "highlighter"}
                style={{ stroke: highlighter.color, color: highlighter.color }}
              />
            }
            disabled={disabled}
          />
        </span>
      </span>

      <ToolPopover
        open={openHighlighter}
        anchorRef={highlighterAnchorRef}
        onClose={() => setOpenHighlighter(false)}
      >
        <HighlighterPopover
          color={highlighter.color}
          size={highlighter.size}
          onChangeColor={(c) => setHighlighter({ color: c })}
          onChangeSize={(w) => setHighlighter({ size: w })}
        />
      </ToolPopover>

      <span className={styles.toolWrap} data-active={value === "pencilOff" ? "1" : "0"}>
        <IconButton
          ariaLabel="펜 끄기"
          onClick={() => {
            closeAll();
            choose("pencilOff");
          }}
          icon={<PencilOff data-active={value === "pencilOff"} />}
          disabled={disabled}
        />
      </span>
    </div>
  );
}
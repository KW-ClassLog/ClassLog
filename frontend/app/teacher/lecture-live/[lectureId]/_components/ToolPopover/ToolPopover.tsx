"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ToolPopover.module.scss";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";
type CapAlign = "center" | "flush-left";

interface ToolPopoverProps {
  open: boolean;
  anchorRef: React.RefObject<Element | null>;
  side?: Side;
  align?: Align;
  offset?: number;

  cap?: boolean;
  capPad?: number;
  capMinWidth?: number;
  capHeight?: number;
  capMatchAnchor?: boolean;
  capOvershoot?: number;
  capOffsetX?: number;
  seamOverlap?: number;
  capAlign?: CapAlign;
  panelOffsetX?: number;

  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function ToolPopover({
  open,
  anchorRef,
  side = "bottom",
  align = "start",
  capAlign = "center",
  offset = -3,
  capOffsetX = 0,
  cap = true,
  capPad = 12,
  capMinWidth = 48,
  capHeight = 20,
  capMatchAnchor = true,
  capOvershoot = 13,
  seamOverlap = 16,
  panelOffsetX = -40,
  onClose,
  className,
  children,
}: ToolPopoverProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: -99999, left: -99999 });
  const [capVars, setCapVars] = useState<{ w: number; h: number; left: number }>({
    w: capMinWidth,
    h: capHeight,
    left: 8,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const handleDown = (target: EventTarget | null) => {
      if (!target || !(target instanceof Node)) return;
      if (boxRef.current?.contains(target)) return;
      if (anchorRef?.current && anchorRef.current.contains(target)) return;
      onClose?.();
    };

    const onPointerDown = (e: PointerEvent) => handleDown(e.target);
    const onMouseDown = (e: MouseEvent) => handleDown(e.target);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose, anchorRef]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const compute = () => {
    if (!open || !boxRef.current || !anchorRef.current) return;

    const a = anchorRef.current.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, margin = 6;

    const panelRect = boxRef.current.getBoundingClientRect();

    let left = 0, top = 0;
    if (side === "bottom") top = a.bottom + offset;
    if (side === "top")    top = a.top - panelRect.height - offset;
    if (side === "left")   left = a.left - panelRect.width - offset;
    if (side === "right")  left = a.right + offset;

    if (side === "top" || side === "bottom") {
      if (align === "start")  left = a.left;
      if (align === "center") left = a.left + a.width / 2 - panelRect.width / 2;
      if (align === "end")    left = a.right - panelRect.width;
    } else {
      if (align === "start")  top = a.top;
      if (align === "center") top = a.top + a.height / 2 - panelRect.height / 2;
      if (align === "end")    top = a.bottom - panelRect.height;
    }

    left += panelOffsetX;

    left = clamp(left, margin, vw - panelRect.width - margin);
    top  = clamp(top,  margin, vh - panelRect.height - margin);
    setPos({ top, left });

    if (cap && side === "bottom") {
      const w = capMatchAnchor ? a.width + capPad * 2 : Math.max(a.width + capPad * 2, capMinWidth);
      const h = capMatchAnchor ? Math.max(a.height + capOvershoot, capHeight) : capHeight;

      const anchorLocalLeft = a.left - left;
      const centerBased = anchorLocalLeft + a.width / 2 - w / 2;

      let capLeft = centerBased + capOffsetX;
      if (capAlign === "flush-left") capLeft = anchorLocalLeft - capPad + capOffsetX;

      setCapVars({ w, h, left: capLeft });
    }
  };

  useLayoutEffect(() => {
    if (!open) return;
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(document.documentElement);
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [
    open, side, align, offset,
    cap, capAlign, capPad, capMinWidth, capHeight, capMatchAnchor, capOvershoot, capOffsetX,
    anchorRef.current,
  ]);

  const node = (
    <div
      ref={boxRef}
      className={`${styles.container} ${className ?? ""}`}
      style={{
        top: pos.top,
        left: pos.left,
        "--cap-w": `${capVars.w}px`,
        "--cap-h": `${capVars.h}px`,
        "--cap-left": `${capVars.left}px`,
        "--seam-overlap": `${seamOverlap}px`,
      } as React.CSSProperties}
      data-side={side}
      data-align={align}
      data-cap={cap ? "1" : "0"}
    >
      {cap && side === "bottom" && <div className={styles.cap} />}
      <div className={styles.panel}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return open ? createPortal(node, document.body) : null;
}
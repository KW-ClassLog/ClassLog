"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLive } from "../../LectureLiveProvider";
import styles from "./DrawingCanvasOverlay.module.scss";

function toRgba(hex: string, a: number) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function DrawingCanvasOverlay({
  selector = "[data-doc-box]",
  currentPage,
}: {
  selector?: string;
  currentPage: number;
}) {
  const { tool, pen } = useLive();
  const [host, setHost] = useState<HTMLElement | null>(null);
  const viewCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageCanvasesRef = useRef<Map<number, HTMLCanvasElement>>(new Map());

  useEffect(() => {
    const find = () => document.querySelector<HTMLElement>(selector);
    let el = find();
    if (el) { setHost(el); return; }
    const mo = new MutationObserver(() => {
      el = find();
      if (el) { setHost(el); mo.disconnect(); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [selector]);

  const getOrCreateBacking = () => {
    const hostEl = host!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = hostEl.getBoundingClientRect();

    let back = pageCanvasesRef.current.get(currentPage);
    if (!back) {
      back = document.createElement("canvas");
      back.width  = Math.max(1, Math.round(rect.width * dpr));
      back.height = Math.max(1, Math.round(rect.height * dpr));
      pageCanvasesRef.current.set(currentPage, back);
    }
    return back;
  };

  const syncFromBacking = () => {
    if (!host || !viewCanvasRef.current) return;
    const view = viewCanvasRef.current;
    const rect = host.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    view.width = Math.max(1, Math.round(rect.width * dpr));
    view.height = Math.max(1, Math.round(rect.height * dpr));
    view.style.width = `${rect.width}px`;
    view.style.height = `${rect.height}px`;

    const vctx = view.getContext("2d")!;
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vctx.clearRect(0, 0, rect.width, rect.height);

    const back = pageCanvasesRef.current.get(currentPage);
    if (back) {
      vctx.drawImage(
        back,
        0, 0, back.width, back.height,
        0, 0, rect.width, rect.height
      );
    }
  };

  useEffect(() => {
    if (!host || !viewCanvasRef.current) return;

    const resize = () => syncFromBacking();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize, true);
    };
  }, [host, currentPage]);

  useEffect(() => {
    syncFromBacking();
  }, [currentPage, host]);


  useEffect(() => {
    if (!host || !viewCanvasRef.current) return;
    const view = viewCanvasRef.current;

    let drawing = false;

    const getLocal = (e: PointerEvent) => {
      const r = view.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };

    const down = (e: PointerEvent) => {
      if (tool !== "pen" && tool !== "eraser" && tool !== "highlighter") return;
      e.preventDefault();
      drawing = true;

      const back = getOrCreateBacking();
      const bctx = back.getContext("2d")!;
      const { x, y, w, h } = getLocal(e);

      const bx = (x / w) * back.width;
      const by = (y / h) * back.height;

      bctx.beginPath();
      bctx.moveTo(bx, by);
    };

    const move = (e: PointerEvent) => {
      if (!drawing) return;
      const back = getOrCreateBacking();
      const bctx = back.getContext("2d")!;
      const { x, y, w, h } = getLocal(e);
      const bx = (x / w) * back.width;
      const by = (y / h) * back.height;

      bctx.lineCap = "round";
      bctx.lineJoin = "round";
      bctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      bctx.lineWidth = tool === "highlighter" ? pen.size * 2 : pen.size;
      bctx.strokeStyle = tool === "highlighter" ? toRgba(pen.color, 0.35) : pen.color;

      bctx.lineTo(bx, by);
      bctx.stroke();

      syncFromBacking();
    };

    const end = () => {
      if (!drawing) return;
      drawing = false;
      const back = pageCanvasesRef.current.get(currentPage);
      back?.getContext("2d")?.closePath();
      syncFromBacking();
    };

    view.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerup", end);
    view.addEventListener("pointerleave", end);
    view.addEventListener("pointercancel", end);

    return () => {
      view.removeEventListener("pointerdown", down);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", end);
      view.removeEventListener("pointerleave", end);
      view.removeEventListener("pointercancel", end);
    };
  }, [host, currentPage, tool, pen.color, pen.size]);

  if (!host) return null;

  return createPortal(
    <canvas
      ref={viewCanvasRef}
      className={styles.overlay}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents:
          tool === "pen" || tool === "eraser" || tool === "highlighter"
            ? "auto"
            : "none",
        touchAction: "none",
        zIndex: 1200,
      }}
      onContextMenu={(e) => e.preventDefault()}
    />,
    host
  );
}
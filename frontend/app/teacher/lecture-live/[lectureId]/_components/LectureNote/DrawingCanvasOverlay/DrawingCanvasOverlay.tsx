"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLive } from "../../LectureLiveProvider";
import styles from "./DrawingCanvasOverlay.module.scss";

export default function DrawingCanvasOverlay({
  selector = "[data-doc-box]",
  currentPage,
}: {
  selector?: string;
  currentPage: number;
}) {
  const { tool, pen, highlighter, eraser, getPageCanvas, getPageCanvasOrNull } = useLive();

  const [host, setHost] = useState<HTMLElement | null>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const pageRef = useRef(currentPage);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

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

  const syncFromBacking = () => {
    if (!host || !viewRef.current) return;
    const view = viewRef.current;
    const rect = host.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    getPageCanvas(pageRef.current, rect.width, rect.height, dpr);


    view.width = Math.max(1, Math.round(rect.width * dpr));
    view.height = Math.max(1, Math.round(rect.height * dpr));
    view.style.width = `${rect.width}px`;
    view.style.height = `${rect.height}px`;

    const vctx = view.getContext("2d")!;
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vctx.clearRect(0, 0, rect.width, rect.height);

    const back = getPageCanvasOrNull(pageRef.current);
    if (back) {
      vctx.drawImage(back, 0, 0, back.width, back.height, 0, 0, rect.width, rect.height);
    }
  };

  useEffect(() => {
    if (!host) return;
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
  }, [host]);

  useEffect(() => { syncFromBacking(); }, [currentPage, host]);

  useEffect(() => {
    if (!cursorRef.current) return;
    cursorRef.current.style.display = tool === "eraser" ? "block" : "none";
  }, [tool]);

useEffect(() => {
  const onClear = () => {
    const back = getPageCanvasOrNull(pageRef.current);
    if (back) {
      const bctx = back.getContext("2d")!;
  
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, back.width, back.height);
    }

    if (viewRef.current) {
      const v = viewRef.current;
      const vctx = v.getContext("2d")!;
      vctx.setTransform(1, 0, 0, 1, 0, 0);
      vctx.clearRect(0, 0, v.width, v.height);
    }

    syncFromBacking();
    requestAnimationFrame(syncFromBacking);
  };

  window.addEventListener("live:clear-page", onClear);
  return () => window.removeEventListener("live:clear-page", onClear);
}, [getPageCanvasOrNull]);

  useEffect(() => {
    if (!host || !viewRef.current || !cursorRef.current) return;

    const view = viewRef.current;
    const cursor = cursorRef.current;
    let drawing = false;

    const getLocal = (e: PointerEvent) => {
      const r = view.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };
    const getScale = () => {
      const back = getPageCanvasOrNull(pageRef.current);
      const vw = view.getBoundingClientRect().width || 1;
      return back ? back.width / vw : Math.max(1, window.devicePixelRatio || 1);
    };

    const showCursor = (x: number, y: number) => {
      if (tool !== "eraser") { cursor.style.display = "none"; return; }
      const d = Math.max(2, eraser.size);
      cursor.style.width = `${d}px`;
      cursor.style.height = `${d}px`;
      cursor.style.left = `${x}px`;
      cursor.style.top  = `${y}px`;
      cursor.style.display = "block";
    };
    const hideCursor = () => { cursor.style.display = "none"; };

    const down = (e: PointerEvent) => {
      if (tool !== "pen" && tool !== "eraser" && tool !== "highlighter") return;
      e.preventDefault();
      drawing = true;
      view.setPointerCapture?.(e.pointerId);
    
      const rect = host.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const back = getPageCanvas(pageRef.current, rect.width, rect.height, dpr);
      const bctx = back.getContext("2d")!;
    
      const { x, y, w, h } = getLocal(e);
      const bx = (x / w) * back.width;
      const by = (y / h) * back.height;
    
      const isHL = tool === "highlighter";
      const basePx = isHL ? highlighter.size : (tool === "eraser" ? eraser.size : pen.size);
    
      bctx.lineCap = "round";
      bctx.lineJoin = "round";
      bctx.globalCompositeOperation =
        tool === "eraser" ? "destination-out" :
        isHL ? "multiply" : "source-over";
    
      bctx.globalAlpha = isHL ? (highlighter.alpha ?? 0.02) : 1;
    
      bctx.strokeStyle = isHL ? highlighter.color : pen.color;
    
      bctx.lineWidth = Math.max(1, basePx * getScale());
    
      bctx.beginPath();
      bctx.moveTo(bx, by);
    
      showCursor(x, y);
    };
    
    const move = (e: PointerEvent) => {
      const { x, y, w, h } = getLocal(e);
      showCursor(x, y);
      if (!drawing) return;
    
      const back = getPageCanvasOrNull(pageRef.current)!;
      const bctx = back.getContext("2d")!;
      const bx = (x / w) * back.width;
      const by = (y / h) * back.height;
    
      const isHL = tool === "highlighter";
      const basePx = isHL ? highlighter.size : (tool === "eraser" ? eraser.size : pen.size);
    
      bctx.lineCap = "round";
      bctx.lineJoin = "round";
      bctx.globalCompositeOperation =
        tool === "eraser" ? "destination-out" :
        isHL ? "multiply" : "source-over";
    
      bctx.globalAlpha = isHL ? (highlighter.alpha ?? 0.02) : 1;
      bctx.strokeStyle = isHL ? highlighter.color : pen.color;
    
      bctx.lineWidth = Math.max(1, basePx * getScale());
    
      bctx.lineTo(bx, by);
      bctx.stroke();
    
      syncFromBacking();
    };

    const end = (e?: PointerEvent) => {
      if (!drawing) { hideCursor(); return; }
      drawing = false;
      const back = getPageCanvasOrNull(pageRef.current);
      back?.getContext("2d")?.closePath();
      if (e) { try { view.releasePointerCapture?.(e.pointerId); } catch {} }
      syncFromBacking();
      hideCursor();
    };

    const enter = (e: PointerEvent) => { const { x, y } = getLocal(e); showCursor(x, y); };
    
    view.addEventListener("pointerdown", down);
    view.addEventListener("pointermove", move);
    view.addEventListener("pointerup", end);
    view.addEventListener("pointerleave", end);
    view.addEventListener("pointercancel", end);
    view.addEventListener("pointerenter", enter);

    return () => {
      view.removeEventListener("pointerdown", down);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerup", end);
      view.removeEventListener("pointerleave", end);
      view.removeEventListener("pointercancel", end);
      view.removeEventListener("pointerenter", enter);
    };
  }, [
    host,
    tool,
    pen.color, pen.size,
    highlighter.color, highlighter.size, highlighter.alpha,
    eraser.size,
    getPageCanvas, getPageCanvasOrNull
  ]);

  if (!host) return null;

  return createPortal(
    <>
      <canvas
        ref={viewRef}
        className={styles.overlay}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: (tool === "pen" || tool === "eraser" || tool === "highlighter") ? "auto" : "none",
          touchAction: "none",
          zIndex: 1200,
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div ref={cursorRef} className={styles.eraserCursor} />
    </>,
    host
  );
}
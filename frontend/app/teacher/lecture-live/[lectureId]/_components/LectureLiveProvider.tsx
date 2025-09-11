"use client";

import React, { createContext, useContext, useMemo, useState, useRef, useCallback } from "react";

export type DocType = "pdf" | "pptx" | "unknown";
type DocState = { url: string; type: DocType; name: string };

export type Tool = "pencilOff" | "pen" | "eraser" | "highlighter";
export type Panel = "files" | "chat";

type PenOptions = { color: string; size: number };
type HighlighterOptions = { color: string; size: number; alpha: number };
type EraserOptions = { size: number };
type DrawStore = Map<number, HTMLCanvasElement>;


interface LiveState {
  tool: Tool;
  isDrawing: boolean;

  panels: Record<Panel, boolean>;

  pen: PenOptions;
  highlighter: HighlighterOptions;
  eraser: EraserOptions;
  doc: DocState;

  setDoc: (d: DocState) => void;
  setTool: (t: Tool) => void;
  togglePanel: (p: Panel) => void;

  setPen: (patch: Partial<PenOptions>) => void;
  setHighlighter: (patch: Partial<HighlighterOptions>) => void;
  setEraser: (patch: Partial<EraserOptions>) => void;

  getPageCanvas: (page: number, w: number, h: number, dpr: number) => HTMLCanvasElement;
  getPageCanvasOrNull: (page: number) => HTMLCanvasElement | null;
  clearPage: (page: number) => void;

  resetDrawings: () => void;
}

const LiveCtx = createContext<LiveState | null>(null);

export function LectureLiveProvider({ children }: { children: React.ReactNode }) {
  const [tool, setToolState] = useState<Tool>("pencilOff");

  const [panels, setPanels] = useState<Record<Panel, boolean>>({
    files: true,
    chat: true,
  });

  const [pen, setPenState] = useState<PenOptions>({
    color: "#111111",
    size: 3,
  });

  const [highlighter, setHighlighterState] = useState<HighlighterOptions>({
    color: "#fcf1b7",
    size: 12,
    alpha: 0.02,
  });

  const [doc, setDocState] = useState<DocState>({
    url: "/file/기말보고서_졸업을하자.pdf",
    type: "pdf",
    name: "기말보고서_졸업을하자.pdf",
  });

  const drawStoreRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const resetDrawings = useCallback(() => drawStoreRef.current.clear(), []);

  const [eraser, setEraserState] = useState<EraserOptions>({ size: 12 });

  const setDoc = (d: DocState) => {
    setDocState(d);
    resetDrawings();
    window.dispatchEvent(new CustomEvent("live:doc-changed"));
  };
  

  const getPageCanvas = useCallback((page: number, w: number, h: number, dpr: number) => {
    let c = drawStoreRef.current.get(page);
    if (!c) {
      c = document.createElement("canvas");
      c.width  = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
      drawStoreRef.current.set(page, c);
    }
    return c;
  }, []);

  const getPageCanvasOrNull = useCallback((page: number) => {
    return drawStoreRef.current.get(page) ?? null;
  }, []);

  const clearPage = useCallback((page: number) => {
    const c = drawStoreRef.current.get(page);
    if (c) c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  }, []);

  const setTool = (t: Tool) => setToolState(t);

  const togglePanel = (p: Panel) =>
    setPanels((prev) => ({ ...prev, [p]: !prev[p] }));

  const setPen = (patch: Partial<PenOptions>) =>
    setPenState((prev) => ({ ...prev, ...patch }));

  const setHighlighter = (patch: Partial<HighlighterOptions>) =>
    setHighlighterState((prev) => ({ ...prev, ...patch }));

  const isDrawing =
    tool === "pen" || tool === "eraser" || tool === "highlighter";

  const setEraser = (patch: Partial<EraserOptions>) =>
    setEraserState((prev) => ({ ...prev, ...patch }));

  const value = useMemo<LiveState>(
    () => ({
      tool,
      isDrawing,
      panels,
      pen,
      highlighter,
      eraser,
      doc,
      setDoc,
      resetDrawings,
      getPageCanvas,
      getPageCanvasOrNull,
      clearPage,
      setTool,
      togglePanel,
      setPen,
      setHighlighter,
      setEraser,
    }),
    [tool, isDrawing, panels, pen, highlighter, eraser, doc, resetDrawings, getPageCanvas, getPageCanvasOrNull, clearPage]
  );

  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>;
}

export const useLive = () => {
  const ctx = useContext(LiveCtx);
  if (!ctx) throw new Error("useLive must be used within LectureLiveProvider");
  return ctx;
};
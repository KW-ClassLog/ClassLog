"use client";

import { useEffect, useState } from "react";
import styles from "./LectureMainGrid.module.scss";
import { useLive } from "../LectureLiveProvider";
import ChatPanel from "../Chating/ChatingPanel/ChatingPanel";
import dynamic from "next/dynamic";
import { FileText } from "lucide-react";

const PageThumbsSidebar = dynamic(
  () => import("../LectureNote/PageThumbsSidebar/PageThumbsSidebar"),
  { ssr: false, loading: () => null }
);

const DocumentViewer = dynamic(
  () => import("../LectureNote/DocumentViewer/DocumentViewer"),
  { ssr: false, loading: () => null }
);

const DrawingCanvasOverlay = dynamic(
  () => import("../LectureNote/DrawingCanvasOverlay/DrawingCanvasOverlay"),
  { ssr: false, loading: () => null }
);

export default function LectureMainGrid() {
  const { panels, doc } = useLive();
  const [count, setCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const resolvedType: "pdf" | "pptx" | undefined =
    doc.type === "pdf" || doc.type === "pptx" ? doc.type : undefined;

  useEffect(() => {
    const resetOnDocChange = () => setCurrentPage(0);
    window.addEventListener("live:doc-changed", resetOnDocChange);
    return () => window.removeEventListener("live:doc-changed", resetOnDocChange);
  }, []);

  useEffect(() => {
    const isTypingTarget = (t: EventTarget | null) => {
      if (!(t instanceof HTMLElement)) return false;
      const tag = t.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || t.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (!doc.url) return;

      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentPage((p) => Math.min(count - 1, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(0, p - 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, doc.url]);

  const EmptyState = (
    <div className={styles.empty}>
      <div className={styles.emptyCard} role="note" aria-live="polite">
        <div className={styles.emptyTitle}>강의자료가 선택되지 않았어요</div>
        <div className={styles.emptyDesc}>
          상단의 {" "}
          <span className={styles.inlineIconWrap} aria-label=" 강의자료 버튼 아이콘">
            <FileText aria-hidden="true" className={styles.inlineIcon} />
          </span>
          버튼을 눌러 자료를 선택해 주세요.
        </div>
      </div>
    </div>
  );

  return (
    <main
      className={styles.grid}
      style={
        {
          "--left-col": panels.files ? "clamp(220px, 18vw, 320px)" : "0px",
          "--right-col": panels.chat ? "min(28vw, 380px)" : "0px",
        } as React.CSSProperties
      }
    >
      <aside className={styles.left}>
        {doc.url ? (
          <PageThumbsSidebar
            fileUrl={doc.url}
            typeOverride={resolvedType}
            currentPage={currentPage}
            onSelect={setCurrentPage}
            onCountChange={setCount}
          />
        ) : (
          <div className={styles.leftEmpty}>
            <span>강의자료 선택 후 썸네일이 표시됩니다.</span>
          </div>
        )}
      </aside>

      <section className={styles.center} data-live-center>
        {doc.url ? (
          <>
            <DocumentViewer
              fileUrl={doc.url}
              typeOverride={resolvedType}
              currentPage={currentPage}
              onChangePage={setCurrentPage}
              onLoad={setCount}
            />
            <DrawingCanvasOverlay currentPage={currentPage} />
          </>
        ) : (
          EmptyState
        )}
      </section>

      <aside className={styles.right}>
        <ChatPanel />
      </aside>
    </main>
  );
}
"use client";

import styles from "./DocumentViewer.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { DocType } from "../../LectureLiveProvider";
import type { PageProps } from "react-pdf";


const PDFDocument = dynamic(() => import("react-pdf").then(m => m.Document), { ssr: false });
const PDFPage = dynamic(() => import("react-pdf").then(m => m.Page),     { ssr: false });

export function getDocType(url: string): DocType {
  const m = url.split("?")[0].toLowerCase();
  if (m.endsWith(".pdf")) return "pdf";
  if (m.endsWith(".pptx")) return "pptx";
  return "unknown";
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (typeof window === "undefined") return pathOrUrl;
  return new URL(pathOrUrl, window.location.origin).toString();
}

export default function DocumentViewer({
  fileUrl,
  currentPage,
  onChangePage,
  onLoad,
  typeOverride,
}: {
  fileUrl: string;
  currentPage: number;
  onChangePage: (i: number) => void;
  onLoad?: (numPages: number) => void;
  typeOverride?: DocType;
}) {
  const type = useMemo(
    () => (typeOverride && typeOverride !== "unknown" ? typeOverride : getDocType(fileUrl)),
    [fileUrl, typeOverride]
  );

  useEffect(() => {
    if (type !== "pdf") return;
    (async () => {
      const m = await import("react-pdf");
      m.pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${m.pdfjs.version}/build/pdf.worker.min.mjs`;
    })();
  }, [type]);

  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const [stageH, setStageH] = useState(0);
  const [naturalW, setNaturalW] = useState(1);
  const [naturalH, setNaturalH] = useState(1);

  useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const cs = getComputedStyle(el);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      setStageW(el.clientWidth - padX);
      setStageH(el.clientHeight - padY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const SAFE_PAD = 2;
  const scale =
    type === "pdf" && naturalW && naturalH
      ? Math.min((stageW - SAFE_PAD) / naturalW, (stageH - SAFE_PAD) / naturalH)
      : 1;

  const handleDocLoad = ({ numPages }: { numPages: number }) => {
    if (type !== "pdf") return;
    onLoad?.(numPages);
    if (currentPage > numPages - 1) onChangePage(numPages - 1);
  };

const handlePageLoad: NonNullable<PageProps["onLoadSuccess"]> = (page) => {
    if (type !== "pdf") return;
    const vp = page.getViewport({ scale: 1 });
    setNaturalW(vp.width);
    setNaturalH(vp.height);
  };

  const docBoxStyle: React.CSSProperties =
    type === "pdf"
      ? { width: Math.max(1, naturalW * scale), height: Math.max(1, naturalH * scale) }
      : { width: "100%", height: "100%" };

  return (
    <div className={styles.viewer}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.docBox} data-doc-box style={docBoxStyle}>
          {type === "pdf" && (
            <PDFDocument file={fileUrl} onLoadSuccess={handleDocLoad} loading="로딩 중…">
              <PDFPage
                pageNumber={currentPage + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={handlePageLoad}
              />
            </PDFDocument>
          )}

          {type === "pptx" && (
            <iframe
              title="PPTX Viewer"
              className={styles.pptxFrame}
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                toAbsoluteUrl(fileUrl)
              )}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
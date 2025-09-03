"use client";

import styles from "./DocumentViewer.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getDocType, toAbsoluteUrl } from "@/types/lectures/documentUtilTypes";

export default function DocumentViewer({
  fileUrl,
  currentPage,
  onChangePage,
  onLoad,
}: {
  fileUrl: string;
  currentPage: number;
  onChangePage: (i: number) => void;
  onLoad?: (numPages: number) => void;
}) {
  const type = useMemo(() => getDocType(fileUrl), [fileUrl]);

  useEffect(() => {
    if (type !== "pdf") return;
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, [type]);

  const stageRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(1);
  const [stageW, setStageW] = useState(0);
  const [stageH, setStageH] = useState(0);
  const [naturalW, setNaturalW] = useState(1);
  const [naturalH, setNaturalH] = useState(1);

  useEffect(() => {
    if (type !== "pdf" || !stageRef.current) return;
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
  }, [type]);

  const SAFE_PAD = 2;
  const scale =
    type === "pdf" && naturalW && naturalH
      ? Math.min((stageW - SAFE_PAD) / naturalW, (stageH - SAFE_PAD) / naturalH)
      : 1;

  const handleDocLoad = ({ numPages }: { numPages: number }) => {
    if (type !== "pdf") return;
    setNumPages(numPages);
    onLoad?.(numPages);
    if (currentPage > numPages - 1) onChangePage(numPages - 1);
  };
  const handlePageLoad = (page: any) => {
    if (type !== "pdf") return;
    const vp = page.getViewport({ scale: 1 });
    setNaturalW(vp.width);
    setNaturalH(vp.height);
  };

  return (
    <div className={styles.viewer}>
      <div ref={stageRef} className={styles.stage}>
        {type === "pdf" && (
          <Document file={fileUrl} onLoadSuccess={handleDocLoad} loading="로딩 중…">
            <Page
              pageNumber={currentPage + 1}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={handlePageLoad}
            />
          </Document>
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
  );
}
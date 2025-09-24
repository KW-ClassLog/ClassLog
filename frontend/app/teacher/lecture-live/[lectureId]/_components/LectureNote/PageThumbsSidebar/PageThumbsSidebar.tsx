"use client";

import styles from "./PageThumbsSidebar.module.scss";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { getDocType } from "../DocumentViewer/DocumentViewer";
import { DocType } from "../../LectureLiveProvider";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PageThumbsSidebar({
  fileUrl,
  currentPage,
  onSelect,
  thumbWidth = 160,
  onCountChange,
  typeOverride,
}: {
  fileUrl: string;
  currentPage: number;
  onSelect: (index: number) => void;
  thumbWidth?: number;
  onCountChange?: (count: number) => void;
  typeOverride?: DocType;
}) {
  const type = typeOverride ?? getDocType(fileUrl);
  const [pdfCount, setPdfCount] = useState<number>(0);

  if (!fileUrl) {
    return (
      <div className={styles.wrap}>
        <div className={styles.placeholder}>썸네일을 표시할 문서가 없습니다.</div>
      </div>
    );
  }

  if (type === "pdf") {
    return (
      <div className={styles.wrap}>
        <div className={styles.list}>
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => {
              setPdfCount(numPages);
              onCountChange?.(numPages);
            }}
            loading={null}
            className={styles.docAsContents}
          >
            {Array.from({ length: pdfCount }, (_, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === currentPage ? styles.active : ""}`}
                onClick={() => onSelect(i)}
                aria-label={`페이지 ${i + 1}`}
              >
                <Page
                  pageNumber={i + 1}
                  width={thumbWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                <div className={styles.pageIndex}>p.{i + 1}</div>
              </button>
            ))}
          </Document>
        </div>
      </div>
    );
  }
}
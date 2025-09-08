"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./LectureNotePopover.module.scss";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import { useLive } from "../../LectureLiveProvider";

type Item = { name: string; url: string; type: "pdf" | "pptx" };

export default function LectureNotePopover({
  onPicked,
}: {
  onPicked?: () => void;
}) {
  const { setDoc, doc } = useLive();

  const initialItems = useMemo<Item[]>(
    () => [
      { name: "2024-DA-2-2-Probability.pdf", url: "/file/2024-DA-2-2-Probability.pdf", type: "pdf" },
      { name: "기말보고서_졸업을하자.pdf", url: "/file/기말보고서_졸업을하자.pdf", type: "pdf" },
    ],
    []
  );

  const [items, setItems] = useState<Item[]>(initialItems);

  const pick = (it: Item) => {
    setDoc({ url: it.url, type: it.type, name: it.name });
    window.dispatchEvent(new Event("live:doc-changed"));
    onPicked?.();
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const objUrlsRef = useRef<string[]>([]);

  const onUploadClick = () => inputRef.current?.click();
  const onUploadChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.toLowerCase().endsWith(".pptx") ? "pptx" : "pdf";
    const url = URL.createObjectURL(f);
    objUrlsRef.current.push(url);
    const it: Item = { name: f.name, url, type: ext as "pdf" | "pptx" };
    setItems((prev) => [it, ...prev]);
    pick(it);
    e.currentTarget.value = "";
  };

  useEffect(() => {
    return () => objUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  return (
    <div className={styles.pop}>
      <div className={styles.list}>
        {items.map((it, i) => (
          <div key={it.url}>
            <button
              type="button"
              onClick={() => pick(it)}
              className={`${styles.row} ${doc?.url === it.url ? styles.active : ""}`}
              aria-label={`${it.name} 열기`}
            >
                
              <FileDisplay fileName={it.name} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.divider} />
      <button type="button" className={styles.uploadBtn} onClick={onUploadClick}>
        강의자료 업로드
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.pptx"
        hidden
        onChange={onUploadChange}
      />
    </div>
  );
}
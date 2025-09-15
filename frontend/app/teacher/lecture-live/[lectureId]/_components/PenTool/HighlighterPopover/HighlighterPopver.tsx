"use client";

import styles from "./HighlighterPopover.module.scss";

export default function HighlighterPopover({
  color,
  size,
  onChangeColor,
  onChangeSize,
}: {
  color: string;
  size: number;
  onChangeColor: (c: string) => void;
  onChangeSize: (w: number) => void;
}) {
  
  const colors = ["#fcf1b7", "#dde6f9", "#d7f9e6", "#ffd9d9", "#f8d5dc"];
  const sizes = [8, 12, 16, 20, 24];

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.swatch} ${color === c ? styles.active : ""}`}
            style={{ backgroundColor: c, ["--ring-color"]: "#3B82F6",
            } as React.CSSProperties
          }
            onClick={() => onChangeColor(c)}
            aria-label={`형광 색상 ${c}`}
          />
        ))}
      </div>

      <div className={styles.row}>
        {sizes.map((w) => (
          <button
            key={w}
            type="button"
            className={`${styles.sizeBtn} ${size === w ? styles.sizeActive : ""}`}
            onClick={() => onChangeSize(w)}
            aria-label={`형광 굵기 ${w}`}
          >
            <span className={styles.sizePreview} style={{ height: w }} />
          </button>
        ))}
      </div>
    </div>
  );
}
"use client";

import styles from "./PenPopover.module.scss";

export default function PenPopover({
  color,
  width,
  onChangeColor,
  onChangeWidth,
}: {
  color: string;
  width: number;
  onChangeColor: (c: string) => void;
  onChangeWidth: (w: number) => void;
}) {
  const colors = ["#111111", "#EB5757", "#1F75FF", "#2ECC71", "#F2C94C"];
  const widths = [2, 3, 5, 8, 12];

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.swatch} ${color === c ? styles.active : ""}`}
            style={{ backgroundColor: c, ["--ring-color" as any]: "#3B82F6",
            } as React.CSSProperties
           }
            onClick={() => onChangeColor(c)}
            aria-label={`색상 ${c}`}
          />
        ))}
      </div>

      <div className={styles.row}>
        {widths.map((w) => (
          <button
            key={w}
            type="button"
            className={`${styles.sizeBtn} ${width === w ? styles.active : ""}`}
            onClick={() => onChangeWidth(w)}
            aria-label={`굵기 ${w}`}
          >
            <span className={styles.sizePreview} style={{ height: w }} />
          </button>
        ))}
      </div>
    </div>
  );
}
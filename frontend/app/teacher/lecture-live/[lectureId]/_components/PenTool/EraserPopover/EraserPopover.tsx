"use client";

import styles from "./EraserPopover.module.scss";

export default function EraserPopover({
  width,
  onChangeWidth,
  onClearPage,
}: {
  width: number;
  onChangeWidth: (w: number) => void;
  onClearPage: () => void;
}) {
  const sizes = [12, 16, 24, 30, 38];

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.circle} ${width === s ? styles.active : ""}`}
            aria-label={`지우개 크기 ${s}`}
            onClick={() => onChangeWidth(s)}
          >
            <span
              className={styles.dot}
              style={{ width: s, height: s }}
            />
          </button>
        ))}
      </div>

      <button type="button" className={styles.clearBtn} onClick={onClearPage}>
        페이지 전체 삭제
      </button>
    </div>
  );
}
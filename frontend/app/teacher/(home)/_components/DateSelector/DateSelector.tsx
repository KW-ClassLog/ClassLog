"use client";

import { useState } from "react";
import styles from "./DateSelector.module.scss";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DateSelector({
  selectedDate,
  onDateSelect,
}: DateSelectorProps) {
  const [currentDate] = useState(selectedDate);
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.currentDate}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월{" "}
          {currentDate.getDate()}일 {daysOfWeek[currentDate.getDay()]}요일
        </div>
      </div>
      <div className={styles.dateList}>
        {[...Array(7)].map((_, index) => {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - 3 + index);
          const isSelected =
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();

          return (
            <button
              key={index}
              className={`${styles.dateItem} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => onDateSelect(date)}
            >
              <span className={styles.dayNumber}>{date.getDate()}</span>
              <span className={styles.dayName}>
                {daysOfWeek[date.getDay()]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

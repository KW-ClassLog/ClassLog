import { useState, useEffect } from "react";

type LectureStatus = "강의 전" | "강의 중" | "강의 종료";

interface UseLectureStatusProps {
  lectureDate: string;
  startTime: string;
  endTime: string;
}

export const useLectureStatus = ({
  lectureDate,
  startTime,
  endTime,
}: UseLectureStatusProps): LectureStatus => {
  const [status, setStatus] = useState<LectureStatus>("강의 전");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const [year, month, day] = lectureDate.split("-").map(Number);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const lectureStartTime = new Date(
        year,
        month - 1,
        day,
        startHour,
        startMinute
      );
      const lectureEndTime = new Date(year, month - 1, day, endHour, endMinute);

      if (now < lectureStartTime) {
        setStatus("강의 전");
      } else if (now >= lectureStartTime && now <= lectureEndTime) {
        setStatus("강의 중");
      } else {
        setStatus("강의 종료");
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // 1분마다 상태 업데이트

    return () => clearInterval(interval);
  }, [lectureDate, startTime, endTime]);

  return status;
};

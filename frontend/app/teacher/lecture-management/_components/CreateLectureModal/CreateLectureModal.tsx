import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateLectureModal.module.scss";
import { useState } from "react";
import { ChangeEvent } from "react";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

interface CreateLectureModalProps {
  onClose: () => void;
}

interface FormData {
  className: string;
  classDate: Date | null;
  startTime: string;
  endTime: string;
}

export default function CreateLectureModal({
  onClose,
}: CreateLectureModalProps) {
  const [formData, setFormData] = useState<FormData>({
    className: "",
    classDate: null,
    startTime: "",
    endTime: "",
  });

  const handleChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, classDate: date }));
  };

  const handleSubmit = () => {
    const koreanTimeZone = "Asia/Seoul";
    const submissionData = {
      ...formData,
      classDate: formData.classDate
        ? formatInTimeZone(formData.classDate, koreanTimeZone, "yyyy-MM-dd")
        : "",
    };
    console.log(submissionData);
    onClose();
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>새로운 강의 생성</h2>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <BasicInput
              value={formData.className}
              onChange={handleChange("className")}
              placeholder="강의 제목을 입력하세요 (차시는 자동으로 입력됩니다)"
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selected={formData.classDate}
                onChange={handleDateChange}
                locale={ko}
                dateFormat="yyyy-MM-dd"
                placeholderText="강의 날짜를 선택하세요"
                className={styles.datePicker}
                isClearable
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <BasicInput
              type="time"
              value={formData.startTime}
              onChange={handleChange("startTime")}
              placeholder="강의 시작시간을 선택하세요"
            />
          </div>
          <div className={styles.formGroup}>
            <BasicInput
              type="time"
              value={formData.endTime}
              onChange={handleChange("endTime")}
              placeholder="강의 종료시간을 선택하세요"
            />
          </div>
        </div>
      </div>
      <FullWidthButton onClick={handleSubmit}>생성하기</FullWidthButton>
    </div>
  );
}

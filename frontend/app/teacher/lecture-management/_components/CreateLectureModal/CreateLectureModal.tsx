import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateLectureModal.module.scss";
import { useState } from "react";
import { ChangeEvent } from "react";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import { createLecture } from "@/api/lectures/createLecture";
import useLectureListStore from "@/store/useLectureListStore";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";

interface CreateLectureModalProps {
  onClose: () => void;
}

interface FormData {
  lectureName: string;
  lectureDate: Date | null;
  startTime: string;
  endTime: string;
}

export default function CreateLectureModal({
  onClose,
}: CreateLectureModalProps) {
  const { selectedClassId } = useSelectedClassStore();
  const { refreshLectureList } = useLectureListStore();
  const [alert, setAlert] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    lectureName: "",
    lectureDate: null,
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
    setFormData((prev) => ({ ...prev, lectureDate: date }));
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      setAlert("클래스를 선택해주세요.");
      return;
    }

    if (
      !formData.lectureName ||
      !formData.lectureDate ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setAlert("모든 필드를 입력해주세요.");
      return;
    }

    const koreanTimeZone = "Asia/Seoul";
    const lectureDate = formatInTimeZone(
      formData.lectureDate,
      koreanTimeZone,
      "yyyy-MM-dd"
    );

    try {
      const response = await createLecture({
        lectureName: formData.lectureName,
        lectureDate,
        classId: selectedClassId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      if (response.isSuccess) {
        await refreshLectureList(selectedClassId);
        onClose();
      } else {
        setAlert(response.message || "강의 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to create lecture:", error);
      setAlert("강의 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>새로운 강의 생성</h2>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <BasicInput
              value={formData.lectureName}
              onChange={handleChange("lectureName")}
              placeholder="강의 제목을 입력하세요 (차시는 자동으로 입력됩니다)"
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selected={formData.lectureDate}
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
      {alert && <AlertModal onClose={() => setAlert(null)}>{alert}</AlertModal>}
    </div>
  );
}

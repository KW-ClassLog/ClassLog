import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateClassModal.module.scss";
import { useState } from "react";
import { ChangeEvent } from "react";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { createClass } from "@/api/classes/createClass";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { CreateClassRequest } from "@/types/classes/createClassTypes";

interface CreateClassModalProps {
  onClose: () => void;
}

interface FormData {
  className: string;
  classTime: string;
}

export default function CreateClassModal({ onClose }: CreateClassModalProps) {
  const [formData, setFormData] = useState<FormData>({
    className: "",
    classTime: "",
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [alert, setAlert] = useState<null | { message: string }>();
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const koreanTimeZone = "Asia/Seoul";
    const submissionData: CreateClassRequest = {
      className: formData.className,
      classDate: formData.classTime,
      startDate: startDate
        ? formatInTimeZone(startDate, koreanTimeZone, "yyyy-MM-dd")
        : "",
      endDate: endDate
        ? formatInTimeZone(endDate, koreanTimeZone, "yyyy-MM-dd")
        : "",
    };
    try {
      const res = await createClass(submissionData);
      if (res && res.isSuccess) {
        setAlert({ message: "클래스가 성공적으로 생성되었습니다." });
      } else {
        setAlert({ message: res?.message || "클래스 생성에 실패했습니다." });
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "클래스 생성에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.className.trim() !== "" &&
    formData.classTime.trim() !== "" &&
    startDate !== null &&
    endDate !== null;

  return (
    <div className={styles.container}>
      <div>
        <h2>새로운 클래스 생성</h2>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <BasicInput
              value={formData.className}
              onChange={handleChange("className")}
              placeholder="클래스 이름을 입력해주세요"
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.datePickerWrapper}>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                locale={ko}
                dateFormat="yyyy-MM-dd"
                placeholderText="시작 날짜와 종료 날짜를 선택해주세요"
                className={styles.datePicker}
                isClearable
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <BasicInput
              value={formData.classTime}
              onChange={handleChange("classTime")}
              placeholder="요일과 시간을 입력해주세요 (예: 월/수 10:15~11:45)"
            />
          </div>
        </div>
      </div>
      <FullWidthButton
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
      >
        {loading ? "생성 중..." : "생성하기"}
      </FullWidthButton>
      {alert && (
        <AlertModal
          onClose={() => {
            setAlert(null);
            if (alert.message.includes("성공")) onClose();
          }}
        >
          {alert.message}
        </AlertModal>
      )}
    </div>
  );
}

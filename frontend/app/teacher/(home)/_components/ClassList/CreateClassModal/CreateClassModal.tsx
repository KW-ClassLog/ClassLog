import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateClassModal.module.scss";
import { useState } from "react";
import { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { createClass } from "@/api/classes/createClass";
import { CreateClassRequest } from "@/types/classes/createClassTypes";
import FormModal from "@/components/Modal/FormModal/FormModal";

interface FormData {
  className: string;
  classTime: string;
}

export default function CreateClassModal({ onClose }: { onClose: () => void }) {
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
        onClose();
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

  return (
    <FormModal
      title="새로운 클래스 생성"
      onSubmit={handleSubmit}
      alert={alert?.message || null}
      setAlert={(msg) => setAlert(msg ? { message: msg } : null)}
      submitText={loading ? "생성 중..." : "생성하기"}
      loading={loading}
    >
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
    </FormModal>
  );
}

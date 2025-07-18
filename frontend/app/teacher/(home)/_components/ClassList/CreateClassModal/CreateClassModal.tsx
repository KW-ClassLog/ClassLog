import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateClassModal.module.scss";
import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { createClass } from "@/api/classes/createClass";
import FormModal from "@/components/Modal/FormModal/FormModal";
import { updateClassInfo } from "@/api/classes/updateClassInfo";

interface FormData {
  className: string;
  classTime: string;
  classId?: string;
  startDate?: string;
  endDate?: string;
}

interface CreateClassModalProps {
  onClose: () => void;
  initialData?: FormData; // 수정 시 기존 데이터
  mode?: "create" | "edit"; // 모드 구분
}

export default function CreateClassModal({
  onClose,
  initialData,
  mode = "create",
}: CreateClassModalProps) {
  const [formData, setFormData] = useState<FormData>({
    className: "",
    classTime: "",
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  // DatePicker onChange 핸들러에서 타입 보장
  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    if (Array.isArray(update) && update.length === 2) {
      setDateRange([update[0], update[1]]);
    } else {
      setDateRange([null, null]);
    }
  };
  const [startDate, endDate] = dateRange;
  const [alert, setAlert] = useState<null | { message: string }>();
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  // edit 모드일 때 initialData로 초기화
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        className: initialData.className || "",
        classTime: initialData.classTime || "",
        classId: initialData.classId,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
      });
      // 날짜 범위 초기화
      if (initialData.startDate && initialData.endDate) {
        setDateRange([
          new Date(initialData.startDate),
          new Date(initialData.endDate),
        ]);
      }
    }
  }, [initialData, mode]);

  // 변경 감지
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const changed =
        formData.className !== initialData.className ||
        formData.classTime !== initialData.classTime ||
        (startDate &&
          initialData.startDate &&
          startDate.toISOString().slice(0, 10) !== initialData.startDate) ||
        (endDate &&
          initialData.endDate &&
          endDate.toISOString().slice(0, 10) !== initialData.endDate);
      setIsChanged(changed as boolean);
    }
  }, [formData, startDate, endDate, initialData, mode]);

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
    const submissionData = {
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
      if (mode === "edit" && initialData?.classId) {
        // 수정 API 호출
        const res = await updateClassInfo({
          classId: initialData.classId,
          data: submissionData,
        });
        if (res && res.isSuccess) {
          setAlert({ message: "클래스가 성공적으로 수정되었습니다." });
          onClose();
        } else {
          setAlert({ message: res?.message || "클래스 수정에 실패했습니다." });
        }
      } else {
        // 기존 생성 로직
        const res = await createClass(submissionData);
        if (res && res.isSuccess) {
          setAlert({ message: "클래스가 성공적으로 생성되었습니다." });
          onClose();
        } else {
          setAlert({ message: res?.message || "클래스 생성에 실패했습니다." });
        }
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "클래스 처리에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      title={mode === "edit" ? "클래스 수정" : "새로운 클래스 생성"}
      onSubmit={handleSubmit}
      alert={alert?.message || null}
      setAlert={(msg) => setAlert(msg ? { message: msg } : null)}
      submitText={
        loading
          ? mode === "edit"
            ? "수정 중..."
            : "생성 중..."
          : mode === "edit"
          ? "완료"
          : "생성하기"
      }
      loading={loading}
      submitDisabled={mode === "edit" ? !isChanged : false}
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
            onChange={handleDateRangeChange}
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

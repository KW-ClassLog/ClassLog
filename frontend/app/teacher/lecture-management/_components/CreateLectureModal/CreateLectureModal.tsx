import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateLectureModal.module.scss";
import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import useSelectedClassStore from "@/store/useSelectedClassStore";
import { createLecture } from "@/api/lectures/createLecture";
import useLectureListStore from "@/store/useLectureListStore";
import FormModal from "@/components/Modal/FormModal/FormModal";
import { updateLectureInfo } from "@/api/lectures/updateLectureInfo";

interface CreateLectureModalProps {
  onClose: () => void;
  initialData?: {
    lectureId: string;
    classId: string;
    lectureName: string;
    lectureDate: string;
    startTime: string;
    endTime: string;
  };
  mode?: "create" | "edit";
}

interface FormData {
  lectureName: string;
  lectureDate: Date | null;
  startTime: string;
  endTime: string;
}

export default function CreateLectureModal({
  onClose,
  initialData,
  mode = "create",
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
  const [isChanged, setIsChanged] = useState(false);

  // edit 모드일 때 initialData로 초기화
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        lectureName: initialData.lectureName,
        lectureDate: initialData.lectureDate
          ? new Date(initialData.lectureDate)
          : null,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
      });
    }
  }, [initialData, mode]);

  // 변경 감지
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const changed =
        formData.lectureName !== initialData.lectureName ||
        (formData.lectureDate &&
          initialData.lectureDate &&
          formData.lectureDate.toISOString().slice(0, 10) !==
            initialData.lectureDate) ||
        formData.startTime !== initialData.startTime ||
        formData.endTime !== initialData.endTime;
      setIsChanged(changed);
    }
  }, [formData, initialData, mode]);

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

  // AlertModal 닫힐 때 모달도 닫히도록 핸들러 추가
  const handleAlertClose = () => {
    setAlert(null);
    onClose();
  };

  const handleSubmit = async () => {
    const classId =
      mode === "edit" && initialData ? initialData.classId : selectedClassId;
    if (!classId) {
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
      if (mode === "edit" && initialData) {
        // 수정 API 호출
        const response = await updateLectureInfo({
          lectureId: initialData.lectureId,
          data: {
            lectureName: formData.lectureName,
            lectureDate,
            classId: initialData.classId,
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        });
        if (response.isSuccess) {
          await refreshLectureList(initialData.classId);
          setAlert("강의가 성공적으로 수정되었습니다.");
          // onClose(); 제거
        } else {
          setAlert(response.message || "강의 수정에 실패했습니다.");
        }
      } else {
        // 기존 생성 로직
        const response = await createLecture({
          lectureName: formData.lectureName,
          lectureDate,
          classId,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });
        if (response.isSuccess) {
          await refreshLectureList(classId);
          setAlert("강의가 성공적으로 생성되었습니다.");
          // onClose(); 제거
        } else {
          setAlert(response.message || "강의 생성에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("Failed to create/update lecture:", error);
      setAlert(
        mode === "edit"
          ? "강의 수정 중 오류가 발생했습니다."
          : "강의 생성 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <FormModal
      title={mode === "edit" ? "강의 수정" : "새로운 강의 생성"}
      onSubmit={handleSubmit}
      alert={alert}
      setAlert={setAlert}
      onAlertClose={handleAlertClose}
      submitText={mode === "edit" ? "완료" : "생성하기"}
      submitDisabled={mode === "edit" ? !isChanged : false}
    >
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
    </FormModal>
  );
}

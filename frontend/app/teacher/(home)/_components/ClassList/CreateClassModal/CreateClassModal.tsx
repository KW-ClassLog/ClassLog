import BasicInput from "@/components/Input/BasicInput/BasicInput";
import styles from "./CreateClassModal.module.scss";
import { useState } from "react";
import { ChangeEvent } from "react";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface CreateClassModalProps {
  onClose: () => void;
}

interface FormData {
  className: string;
  startDate: string;
  endDate: string;
  classTime: string;
}

export default function CreateClassModal({ onClose }: CreateClassModalProps) {
  const [formData, setFormData] = useState<FormData>({
    className: "",
    startDate: "",
    endDate: "",
    classTime: "",
  });

  const handleChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = () => {
    console.log(formData);
    onClose();
  };

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
                className="datepicker"
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                selected={this.state.startDate}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                maxDate={new Date()}
                onChange={(dates) => this.setChangeDate(dates)}
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
      <FullWidthButton onClick={handleSubmit}>생성하기</FullWidthButton>
    </div>
  );
}

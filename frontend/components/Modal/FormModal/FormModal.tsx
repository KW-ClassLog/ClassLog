import React from "react";
import styles from "./FormModal.module.scss";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

interface FormModalProps {
  title: string;
  onSubmit: () => void;
  alert?: string | null;
  setAlert?: (msg: string | null) => void;
  submitText?: string;
  loading?: boolean;
  children: React.ReactNode;
  submitDisabled?: boolean;
}

export default function FormModal({
  title,
  onSubmit,
  alert,
  setAlert,
  submitText = "확인",
  loading = false,
  children,
  submitDisabled = false,
}: FormModalProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.form}>{children}</div>
      <div className={styles.buttonWrapper}>
        <FullWidthButton
          onClick={onSubmit}
          disabled={loading || submitDisabled}
        >
          {loading ? "처리 중..." : submitText}
        </FullWidthButton>
      </div>
      {alert && setAlert && (
        <AlertModal onClose={() => setAlert(null)}>{alert}</AlertModal>
      )}
    </div>
  );
}

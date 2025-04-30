"use client";

import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import { useSignupStore } from "@/store/useSignupStore";
import { signup } from "@/api/users/signup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import { ROUTES } from "@/constants/routes";

export default function SignupButton() {
  const { role, name, phoneNumber, organization, email, password, setField } =
    useSignupStore();
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  const router = useRouter();

  const isFormComplete =
    role !== null &&
    name.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    organization.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  const handleSignup = async () => {
    try {
      const result = await signup({
        role: role as "TEACHER" | "STUDENT",
        name,
        phoneNumber,
        organization,
        email,
        password,
      });
      if (result.isSuccess) {
        setModalMessage("회원가입이 성공적으로 완료되었습니다.");
        setOnConfirm(() => () => {
          setModalMessage(null);

          // 스토어 초기화
          setField("role", null);
          setField("name", "");
          setField("phoneNumber", "");
          setField("organization", "");
          setField("email", "");
          setField("password", "");

          router.push(ROUTES.login);
        });
      } else {
        setModalMessage(result.message || "회원가입에 실패했습니다.");
        setOnConfirm(() => () => {
          setModalMessage(null);
        });
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setModalMessage("네트워크 오류가 발생했습니다.");
      setOnConfirm(() => () => {
        setModalMessage(null);
      });
    }
  };

  return (
    <>
      <FullWidthButton onClick={handleSignup} disabled={!isFormComplete}>
        회원가입
      </FullWidthButton>
      {modalMessage && onConfirm && (
        <AlertModal onClose={onConfirm}>{modalMessage}</AlertModal>
      )}
    </>
  );
}

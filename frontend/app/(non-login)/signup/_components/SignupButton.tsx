"use client";

import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import { useSignupStore } from "@/store/useSignupStore";

export default function SignupButton() {
  const { role, name, phoneNumber, organization, email, password } =
    useSignupStore();

  const isFormComplete =
    role !== null &&
    name.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    organization.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  return (
    <FullWidthButton
      onClick={() => {
        console.log("회원가입 요청");
      }}
      disabled={!isFormComplete}
    >
      회원가입
    </FullWidthButton>
  );
}

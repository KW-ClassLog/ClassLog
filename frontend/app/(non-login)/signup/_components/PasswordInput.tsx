"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import { useState } from "react";

export default function PasswordInput() {
  const { setField } = useSignupStore();
  const [rawPassword, setRawPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  return (
    <>
      <BasicInput
        value={rawPassword}
        type="password"
        placeholder="비밀번호"
        onChange={(e) => {
          const newPassword = e.target.value;
          setRawPassword(newPassword);
          if (newPassword === confirmPassword) {
            setField("password", newPassword);
          } else {
            setField("password", "");
          }
        }}
      />
      <BasicInput
        value={confirmPassword}
        type="password"
        placeholder="비밀번호 확인"
        onChange={(e) => {
          const newConfirm = e.target.value;
          setConfirmPassword(newConfirm);
          if (rawPassword === newConfirm) {
            setField("password", rawPassword);
          } else {
            setField("password", "");
          }
        }}
        error={confirmPassword.length > 0 && confirmPassword !== rawPassword}
        errorMessage={
          confirmPassword.length > 0 && confirmPassword !== rawPassword
            ? "비밀번호가 일치하지 않습니다."
            : undefined
        }
      />
    </>
  );
}

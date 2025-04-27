"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";

export default function PasswordInput() {
  const { password, confirmPassword, setField } = useSignupStore();

  return (
    <>
      <BasicInput
        value={password}
        placeholder="비밀번호"
        onChange={(e) => setField("password", e.target.value)}
      />
      <BasicInput
        value={confirmPassword}
        placeholder="비밀번호 확인"
        onChange={(e) => setField("confirmPassword", e.target.value)}
      />
    </>
  );
}

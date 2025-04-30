"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import { useEffect, useState } from "react";

export default function PasswordInput() {
  const { password, setField } = useSignupStore();
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      setField("password", password);
    }
  }, [password, confirmPassword, setField]);

  return (
    <>
      <BasicInput
        value={password}
        type="password"
        placeholder="비밀번호"
        onChange={(e) => setField("password", e.target.value)}
      />
      <BasicInput
        value={confirmPassword}
        type="password"
        placeholder="비밀번호 확인"
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={confirmPassword.length > 0 && confirmPassword !== password}
        errorMessage={
          confirmPassword.length > 0 && confirmPassword !== password
            ? "비밀번호가 일치하지 않습니다."
            : undefined
        }
      />
    </>
  );
}

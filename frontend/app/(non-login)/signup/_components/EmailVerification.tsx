"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/api/users/verifyEmail"; // 경로는 네 프로젝트 구조에 맞게 조정

export default function EmailVerification() {
  const { email, verificationCode, setField } = useSignupStore();
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  return (
    <>
      <div className={styles.emailWrapper}>
        <BasicInput
          value={email}
          type="email"
          placeholder="이메일"
          onChange={(e) => setField("email", e.target.value)}
        />
        <FullWidthButton
          onClick={async () => {
            const response = await verifyEmail({ email });
            if (response.isSuccess) {
              console.log("인증번호:", response.result?.authCode);
            } else {
              console.error("이메일 인증 실패:", response.message);
            }
          }}
          disabled={!isEmailValid}
        >
          이메일 인증
        </FullWidthButton>
      </div>
      <BasicInput
        value={verificationCode}
        placeholder="인증번호 확인"
        onChange={(e) => setField("verificationCode", e.target.value)}
      />
    </>
  );
}

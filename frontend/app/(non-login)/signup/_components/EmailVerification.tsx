"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";

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
          onClick={() => {
            console.log("이메일 인증 요청");
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

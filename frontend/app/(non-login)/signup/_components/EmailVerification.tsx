"use client";

import { useSignupStore } from "@/store/useSignupStore";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/api/users/verifyEmail";

export default function EmailVerification() {
  const { setField } = useSignupStore();
  const [emailInput, setEmailInput] = useState<string>(""); // 사용자가 입력한 이메일 필드
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 형식
  const [authCode, setAuthCode] = useState<string>(""); // 백엔드에서 보내준 인증 코드
  const [verificationCode, setVerificationCode] = useState<string>(""); // 사용자가 입력한 인증 코드
  const [isVerified, setIsVerified] = useState(false); // 백엔드에서 보내준 인증코드와 사용자가 입력한 인증코드가 동일한지
  const [countdown, setCountdown] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 이메일 입력 인풋에 변경사항이 있을 때마다
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailInput));
    setAuthCode("");
    setVerificationCode("");
    setIsVerified(false);
    setField("email", "");
  }, [emailInput]);

  // 이메일 인증 버튼 클릭시
  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      const response = await verifyEmail({ email: emailInput });
      if (response.isSuccess) {
        if (response.result?.authCode) {
          setAuthCode(response.result.authCode.toString());
          setCountdown(180); // 3분 카운트다운
          setErrorMessage("");
        }
      } else {
        setErrorMessage(response.message || "이메일 인증 요청에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 카운트다운이 시작되면
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (countdown === 0 && authCode) {
      setAuthCode("");
      setVerificationCode("");
    }
  }, [countdown, authCode]);

  // 백엔드에서 보내준 입력코드와 입력한 인증코드가 동일하다면
  useEffect(() => {
    if (verificationCode && verificationCode === authCode) {
      setField("email", emailInput);
      setIsVerified(true);
      setVerificationCode("");
      setAuthCode("");
      setCountdown(0);
    }
  }, [verificationCode, authCode, emailInput, setField]);

  return (
    <>
      <div className={styles.emailWrapper}>
        <BasicInput
          value={emailInput}
          type="email"
          placeholder="이메일"
          onChange={(e) => setEmailInput(e.target.value)}
          error={errorMessage !== ""}
          errorMessage={errorMessage}
        />
        {countdown > 0 ? (
          <FullWidthButton onClick={handleVerifyEmail} disabled={true}>
            {Math.floor(countdown / 60)}:
            {String(countdown % 60).padStart(2, "0")} 남음
          </FullWidthButton>
        ) : (
          <FullWidthButton
            onClick={handleVerifyEmail}
            disabled={!isEmailValid || isVerified || loading}
          >
            {isVerified ? "인증 완료" : loading ? "전송 중..." : "이메일 인증"}
          </FullWidthButton>
        )}
      </div>
      {!isVerified && authCode && (
        <BasicInput
          value={verificationCode}
          placeholder="인증번호 확인"
          onChange={(e) => setVerificationCode(e.target.value)}
          error={verificationCode.length > 0 && verificationCode !== authCode}
          errorMessage={
            verificationCode.length > 0 && verificationCode !== authCode
              ? "인증번호가 일치하지 않습니다."
              : undefined
          }
        />
      )}
    </>
  );
}

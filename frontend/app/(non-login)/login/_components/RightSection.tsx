"use client";

import styles from "../page.module.scss";
import { useState } from "react";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";

type RightSectionProps = {
  isMobile: boolean;
};

export default function RightSection({ isMobile }: RightSectionProps) {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("로그인 시도:", { emailId, password });
  };

  return (
    <div className={styles.rightSection}>
      {isMobile && <BackWithTitleHeader title="로그인" />}
      <div className={styles.loginForm}>
        <Image
          src="/images/logo3.png"
          alt="ClassLog Logo"
          width={150}
          height={50}
        />
        <BasicInput
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="email"
          placeholder="이메일을 입력해주세요"
        />
        <BasicInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="비밀번호를 입력해주세요"
        />

        {/* TODO :비밀번호 찾기 기능은 추후에 추가 예정 */}
        <p className={styles.forgetPassword}>비밀번호를 잊으셨나요?</p>
        <FullWidthButton onClick={handleLogin}>로그인</FullWidthButton>
        <div className={styles.signupLink}>
          계정이 없으신가요? <Link href={ROUTES.signup}>회원가입하기</Link>
        </div>
        <div className={styles.or}>OR</div>
        <button className={styles.kakaoButton}>
          <Image
            src="/images/kakao_logo.png"
            alt="Kakao Logo"
            width={20}
            height={20}
          />
          <p>카카오 로그인</p>
        </button>
      </div>
    </div>
  );
}

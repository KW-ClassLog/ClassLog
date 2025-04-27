"use client";

import VerticalCenterContainer from "@/components/Container/VerticalCenterContainer/VerticalCenterContainer";
import Image from "next/image";
import styles from "./page.module.scss"; // 스타일을 해당 파일에서 작성
import FullWidthButton from "@/components/Button/FullWidthButton/FullWidthButton";
import BasicInput from "@/components/Input/BasicInput/BasicInput";
import { useEffect, useState } from "react";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";
import { Briefcase, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "teacher" | "student" | null
  >(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 이메일이 변경될 때마다 이메일 형식 검사
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 아주 기본적인 이메일 정규표현식
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  return (
    <>
      {isMobile && <BackWithTitleHeader title="회원가입" />}
      <VerticalCenterContainer>
        <div className={styles.signupContainer}>
          <Image
            src="/images/logo3.png" // 로고 이미지 경로
            alt="ClassLog Logo"
            width={200} // 크기는 적당히 설정
            height={60}
          />
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.teacherButton} ${
                selectedRole === "teacher" ? styles.selected : ""
              }`}
              onClick={() => setSelectedRole("teacher")}
            >
              <Briefcase size={40} strokeWidth={1.2} />
              <div>교사용 계정</div>
            </button>
            <button
              type="button"
              className={`${styles.studentButton} ${
                selectedRole === "student" ? styles.selected : ""
              }`}
              onClick={() => setSelectedRole("student")}
            >
              <GraduationCap size={40} strokeWidth={1.2} />
              <div>학생용 계정</div>
            </button>
          </div>
          <form className={styles.formContainer}>
            <BasicInput
              value={name}
              placeholder="이름"
              onChange={(e) => setName(e.target.value)}
            />
            <BasicInput
              value={phoneNumber}
              type="tel"
              placeholder="전화번호"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <BasicInput
              value={organization}
              placeholder="소속 (선택)"
              onChange={(e) => setOrganization(e.target.value)}
            />
            <div className={styles.emailWrapper}>
              <BasicInput
                value={email}
                type="email"
                placeholder="이메일"
                onChange={(e) => setEmail(e.target.value)}
              />
              <FullWidthButton
                onClick={() => {
                  console.log("이메일 인증 요청");
                }}
                disabled={!isEmailValid} // ✅ 버튼 비활성화 처리
              >
                이메일 인증
              </FullWidthButton>
            </div>
            <BasicInput
              value={verificationCode}
              placeholder="인증번호 확인"
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <BasicInput
              value={password}
              placeholder="비밀번호"
              onChange={(e) => setPassword(e.target.value)}
            />
            <BasicInput
              value={confirmPassword}
              placeholder="비밀번호 확인"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FullWidthButton
              onClick={() => {
                console.log();
              }}
            >
              회원가입
            </FullWidthButton>
          </form>
        </div>
      </VerticalCenterContainer>
    </>
  );
}

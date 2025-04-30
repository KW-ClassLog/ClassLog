"use client";

import VerticalCenterContainer from "@/components/Container/VerticalCenterContainer/VerticalCenterContainer";
import Image from "next/image";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import BackWithTitleHeader from "@/components/Header/Student/BackWithTitleHeader/BackWithTitleHeader";
import RoleSelect from "./_components/RoleSelect";
import NameInput from "./_components/NameInput";
import PhoneInput from "./_components/PhoneInput";
import OrganizationInput from "./_components/OrganizationInput";
import EmailVerification from "./_components/EmailVerification";
import PasswordInput from "./_components/PasswordInput";
import SignupButton from "./_components/SignupButton";

export default function SignupPage() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && <BackWithTitleHeader title="회원가입" />}
      <VerticalCenterContainer>
        <div className={styles.signupContainer}>
          <Image
            src="/images/logo3.png"
            alt="ClassLog Logo"
            width={200}
            height={60}
            className={styles.logo}
          />
          <form className={styles.formContainer}>
            <RoleSelect />
            <NameInput />
            <PhoneInput />
            <OrganizationInput />
            <EmailVerification />
            <PasswordInput />
            <SignupButton />
          </form>
        </div>
      </VerticalCenterContainer>
    </>
  );
}

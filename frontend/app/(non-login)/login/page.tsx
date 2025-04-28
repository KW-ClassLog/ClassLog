"use client";

import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import LeftSection from "./_components/LeftSection";
import RightSection from "./_components/RightSection";

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.loginPage}>
      {!isMobile && <LeftSection />}
      <RightSection isMobile={isMobile} />
    </div>
  );
}

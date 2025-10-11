"use client";

import { useRef } from "react";
import HeroSection from "./_components/HeroSection";
import IntroSection from "./_components/IntroSection";
import Navbar from "./_components/Navbar";
import styles from "./page.module.scss";

export default function LandingPage() {
  const introSectionRef = useRef<HTMLElement>(null);

  return (
    <div>
      <Navbar />
      <div className={styles.contents}>
        <HeroSection introSectionRef={introSectionRef} />
        <IntroSection ref={introSectionRef} />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../page.module.scss";
import { ROUTES } from "@/constants/routes";
import { IMAGES } from "@/constants/images";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <Image
        src={isScrolled ? IMAGES.logo3 : IMAGES.logo5}
        alt="logo"
        width={200}
        height={100}
        className={styles.logo}
      />
      <Link href={ROUTES.login} className={styles.login}>
        Login
      </Link>
    </nav>
  );
}

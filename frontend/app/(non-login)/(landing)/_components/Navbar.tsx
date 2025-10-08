import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.scss";
import { ROUTES } from "@/constants/routes";
import { IMAGES } from "@/constants/images";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Image
        src={IMAGES.logo5}
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

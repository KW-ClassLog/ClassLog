import { GetHomeProfileInfoResult } from "@/types/users/getHomeProfileInfoTypes";
import styles from "./HeaderSection.module.scss";
import Image from "next/image";

interface HeaderSectionProps {
  profileInfo: GetHomeProfileInfoResult;
}

export default function HeaderSection({ profileInfo }: HeaderSectionProps) {
  return (
    <div className={styles.headerSection}>
      <div className={styles.greeting}>
        <span className={styles.hello}>Hello,</span>
        <span className={styles.name}>{profileInfo.name}님</span>
      </div>
      <div className={styles.profileIcon}>
        <div className={styles.profileCircle}>
          <Image
            src={profileInfo.profile || "/images/default_profile.jpg"}
            alt="profile"
            width={56}
            height={56}
            className={styles.profileImage}
          />
        </div>
      </div>
    </div>
  );
}

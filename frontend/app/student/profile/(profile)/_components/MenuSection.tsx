import Link from "next/link";
import styles from "../page.module.scss";

export default function MenuSection() {
  return (
    <div className={styles.menuSection}>
      <ul>
        <li>
          <Link href="#">알림 설정</Link>
          {/* TODO: 추후 실제 알림설정 경로명으로 수정 */}
        </li>
        <li>
          <Link href="/login">로그아웃</Link>
        </li>
      </ul>
    </div>
  );
}

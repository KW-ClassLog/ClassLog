import Link from "next/link";
import styles from "./NotFound404.module.scss";

export default function NotFound404() {
  return (
    <>
      <div>
        <h1 className={styles.heading}>
          404
          <br />
          ERROR
        </h1>
        <h2 className={styles.subheading}>
          죄송합니다. 찾을 수 없는 페이지입니다.
          <br />
          존재하지 않는 주소를 입력하셨거나,
          <br />
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </h2>
      </div>
      <Link href="/" className={styles.link}>
        홈으로 돌아가기
      </Link>
    </>
  );
}

import { IMAGES } from "@/constants/images";
import styles from "../page.module.scss";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

export function StartButtonSection() {
  const router = useRouter();
  return (
    <section className={styles.startButtonSection}>
      <Image src={IMAGES.logo5} alt="ClassLog Logo" width={98} height={28} />
      <div>
        <h2>
          지금 바로 ClassLog를
          <br />
          시작해보세요!
        </h2>
        <p>
          수업의 시작부터 끝까지, 지금 ClassLog와 함께하세요.
          <br />
          기록하고, 공유하고, 더 깊이 있게 배우는 경험을 제공합니다.
        </p>
        <button
          onClick={() => {
            router.push(ROUTES.login);
          }}
        >
          <p>시작하기</p>
          <MoveRight />
        </button>
      </div>
      <Image src={IMAGES.logo6} alt="ClassLog Logo" width={293} height={320} />
    </section>
  );
}

import React from "react";
import styles from "../page.module.scss";
import {
  MessageCircle,
  MessageCircleQuestion,
  PencilLine,
  Videotape,
} from "lucide-react";

const FEATURES = [
  {
    icon: <MessageCircle />,
    title: "즉시 질문, 즉시 피드백",
    description:
      "수업 중 궁금한 점은 바로 질문하고 실시간으로 소통할 수 있어요.",
  },
  {
    icon: <MessageCircleQuestion />,
    title: "AI 기반 맞춤형 퀴즈",
    description:
      "강의자료와 녹음을 바탕으로 AI가 자동으로 퀴즈를 만들어요. 복습과 이해도 확인이 더 쉬워집니다.",
  },
  {
    icon: <PencilLine />,
    title: "강의자료 업로드 & 수업용 실시간 필기",
    description:
      "강의 중 자료에 바로 필기하며 핵심 내용을 학생들과 함께 나눌 수 있어요.",
  },
  {
    icon: <Videotape />,
    title: "언제든 다시 듣는 수업",
    description:
      "수업은 자동 녹음되며, 언제든 다시 듣거나 다운로드할 수 있어요.",
  },
];

export default function IntroSection({
  ref,
}: {
  ref: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section ref={ref} className={styles.introSection}>
      <div className={styles.introHeader}>
        <h2 className={styles.introTitle}>
          What You Can Do
          <br />
          with ClassLog
        </h2>
        <div className={styles.introDescription}>
          <p className={styles.introSubtitle}>
            ClassLog의 핵심 기능 4가지를 소개합니다!
          </p>
          <p className={styles.introText}>
            실시간 질문, AI 기반 퀴즈 생성, 강의자료 업로드 및 필기, 자동 수업
            녹음 등 <br />
            수업의 전 과정을 하나의 플랫폼에서 관리하고, 학습의 흐름을 놓치지
            않도록 도와줍니다.
          </p>
        </div>
      </div>
      <div className={styles.featuresContainer}>
        {FEATURES.map((feature) => (
          <div key={feature.title} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

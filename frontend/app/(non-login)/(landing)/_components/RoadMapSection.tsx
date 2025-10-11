import styles from "../page.module.scss";

const ROAD_MAP = [
  {
    title: "강사",
    steps: [
      "클래스 생성",
      "클래스별 강의 생성",
      "강의자료 업로드",
      "강의 시작 (필기 + 질문 뷰어 + 자동 녹음)",
      "강의 종료 후 AI 퀴즈 자동 생성 및 배포",
      "퀴즈 결과 기반 대시보드 제공",
    ],
  },
  {
    title: "학생",
    steps: [
      "클래스 입장",
      "강의자료 다운로드",
      "실시간 질문 참여",
      "녹음 파일 다운로드 및 다시 듣기",
      "AI 퀴즈 풀기 + 결과 확인",
    ],
  },
];

export default function RoadMapSection() {
  return (
    <section className={styles.roadMapSection}>
      <div className={styles.roadMapHeader}>
        <h2 className={styles.roadMapTitle}>HOW IT WORKS?</h2>
        <div className={styles.roadMapDescription}>
          <div className={styles.roadMapText}>
            ClassLog, 어떻게 활용할 수 있을까요?
            <br />
            강사와 학생 각각의 흐름에 맞춰 스마트한 학습 경험을 제공합니다.
            <br />
            수업 전부터 수업 중, 수업 후까지 — 모든 과정을 ClassLog 하나로
            완성하세요.
          </div>
          <div className={styles.roadMapCta}>
            <p>
              Get to know More <br />
              about ClassLog
            </p>
          </div>
        </div>
      </div>
      <div className={styles.roadMapCards}>
        {ROAD_MAP.map((item) => (
          <div key={item.title} className={styles.roadMapCard}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <ul className={styles.stepsList}>
              {item.steps.map((step, index) => (
                <li key={step} className={styles.stepItem}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

interface Material {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}
interface Question {
  id: string;
  user: { name: string; avatarUrl: string };
  content: string;
  time: string;
}
interface Audio {
  name: string;
  size: string;
  url: string;
}
interface QuizSummary {
  totalParticipants: number;
  quizCount: number;
  averageScore: number;
  onViewDetails: () => void;
}

interface LectureMainGridProps {
  materials: Material[];
  questions: Question[];
  audio: Audio;
  quizSummary: QuizSummary;
}

export default function LectureMainGrid({
  materials,
  questions,
  audio,
  quizSummary,
}: LectureMainGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 24,
      }}
    >
      {/* 강의자료, 질문, 녹음본, 퀴즈 요약 박스는 추후 컴포넌트로 분리 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <b>강의자료</b>
        {/* 자료 리스트 렌더링 예시 */}
        <ul style={{ marginTop: 16 }}>
          {materials.map((m) => (
            <li key={m.id} style={{ marginBottom: 8 }}>
              {m.name}{" "}
              <span style={{ color: "#888", fontSize: 14 }}>({m.size})</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <b>질문 목록</b>
        <ul style={{ marginTop: 16 }}>
          {questions.map((q) => (
            <li key={q.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>{q.user.name}</span>:{" "}
              {q.content}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <b>강의 녹음본</b>
        <div style={{ marginTop: 16 }}>
          {audio.name}{" "}
          <span style={{ color: "#888", fontSize: 14 }}>({audio.size})</span>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 2px 8px #eee",
        }}
      >
        <b>퀴즈 결과 요약</b>
        <div style={{ marginTop: 16 }}>
          <div>총 응답자: {quizSummary.totalParticipants}명</div>
          <div>퀴즈 수: {quizSummary.quizCount}개</div>
          <div>전체 평균 정답률: {quizSummary.averageScore}%</div>
          <button
            style={{
              marginTop: 12,
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
            }}
            onClick={quizSummary.onViewDetails}
          >
            결과 자세히 보기
          </button>
        </div>
      </div>
    </div>
  );
}

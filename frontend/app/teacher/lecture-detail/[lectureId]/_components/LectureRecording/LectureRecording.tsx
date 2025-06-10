"use client";

import FileDisplay from "@/components/FileDisplay/FileDisplay";
import styles from "./LectureRecording.module.scss";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface Audio {
  lectureId: string;
  audioUrl: string;
}

interface LectureRecordingProps {
  lectureId: string;
}

export default function LectureRecording({ lectureId }: LectureRecordingProps) {
  const [audio, setAudio] = useState<Audio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API 호출로 변경
    setAudio({
      lectureId: "53d51ffb-729d-432f-82c4-f414d9d84860",
      audioUrl: "https://s3.amazonaws.com/bucket-name/lecture1.mp3",
    });
    setLoading(false);
  }, [lectureId]);

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlParts = url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      return fileName || "녹음파일";
    } catch {
      return "녹음파일";
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>강의 녹음본</h2>
      <p className={styles.description}>
        * 강의 시작 시 자동 녹음이 진행되며, 종료 후 녹음본이 생성됩니다
      </p>
      <div className={styles.audioInfo}>
        {audio ? (
          <div className={styles.audioItem}>
            <span className={styles.audioName}>
              <FileDisplay fileName={getFileNameFromUrl(audio.audioUrl)} />
              <Download />
            </span>
            <audio controls className={styles.audioPlayer}>
              <source src={audio.audioUrl} type="audio/mpeg" />
              브라우저가 오디오를 지원하지 않습니다.
            </audio>
          </div>
        ) : (
          <div className={styles.emptyState}>등록된 녹음본이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

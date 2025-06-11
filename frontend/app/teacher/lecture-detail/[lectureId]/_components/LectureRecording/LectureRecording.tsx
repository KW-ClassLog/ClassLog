"use client";

import FileDisplay from "@/components/FileDisplay/FileDisplay";
import styles from "./LectureRecording.module.scss";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { fetchAudioFile } from "@/api/lectures/fetchAudioFile";
import { useLectureDetail } from "../LectureDetailContext";

interface Audio {
  lectureId: string;
  audioUrl: string;
}

export default function LectureRecording() {
  const { lectureId } = useLectureDetail();
  const [audio, setAudio] = useState<Audio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAudioFile(lectureId);

        if (response.isSuccess && response.result) {
          setAudio({
            lectureId: response.result.lectureId,
            audioUrl: response.result.audioUrl,
          });
        } else {
          setAudio(null);
        }
      } catch (err) {
        console.error("오디오 파일 조회 실패:", err);
        setError("오디오 파일을 불러오는 중 오류가 발생했습니다.");
        setAudio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
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

  if (error) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>강의 녹음본</h2>
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

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

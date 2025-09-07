import React, { useState, useEffect } from "react";
import { useLectureStatusStore } from "@/store/useLectureStatusStore";
import { FetchAudioFileResult } from "@/types/lectures/fetchAudioFileTypes";
import { fetchAudioFile } from "@/api/lectures/fetchAudioFile";
import { Download, Mic } from "lucide-react";
import FileDisplay from "@/components/FileDisplay/FileDisplay";
import IconButton from "@/components/Button/IconButton/IconButton";
import styles from "./LecrureRecordSection.module.scss";
import NoDataView from "@/components/NoDataView/NoDataView";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

interface LecrureRecordSectionProps {
  lectureId: string;
}

export default function LecrureRecordSection({
  lectureId,
}: LecrureRecordSectionProps) {
  const { lectureStatus } = useLectureStatusStore();
  const [audio, setAudio] = useState<FetchAudioFileResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case "beforeLecture":
      case "onLecture":
        return "강의가 종료된 후 강의 녹음을 확인할 수 있습니다. ";
      case "makeQuiz":
      case "checkDashboard":
        return null;
      default:
        return "강의 중";
    }
  };

  const handleDownload = async () => {
    if (!audio?.audioUrl) return;

    try {
      const response = await fetch(audio.audioUrl);
      if (!response.ok) {
        throw new Error("다운로드에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = audio.audioName || "강의녹음본.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 실패:", err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAudioFile(lectureId);

        if (response.isSuccess && response.result) {
          setAudio(response.result);
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

  if (!lectureStatus) return null;

  if (loading) return <LoadingSpinner text="강의 녹음본을 불러오는 중..." />;

  if (error) {
    return (
      <div className={styles.card}>
        <NoDataView
          icon={Mic}
          title={"강의 녹음본을 불러올 수 없습니다."}
          description={""}
        />
      </div>
    );
  }

  return (
    <div>
      {getStatusText(lectureStatus) !== null ? (
        <div>{getStatusText(lectureStatus)}</div>
      ) : audio ? (
        <div className={styles.audioItem}>
          <span className={styles.audioName}>
            <FileDisplay fileName={audio.audioName} />
            <IconButton
              icon={<Download />}
              onClick={handleDownload}
              ariaLabel={"강의 녹음본 다운로드"}
            />
          </span>
          <audio controls className={styles.audioPlayer}>
            <source src={audio.audioUrl} type="audio/mpeg" />
            브라우저가 오디오를 지원하지 않습니다.
          </audio>
        </div>
      ) : (
        <NoDataView
          icon={Mic}
          title={"등록된 녹음본이 없습니다."}
          description={""}
        />
      )}
    </div>
  );
}

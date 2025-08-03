import React, { useEffect, useRef, useState } from "react";
import styles from "./QRScanModal.module.scss";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import { Camera, X } from "lucide-react";

type QRScanModalProps = {
  onClose: () => void;
};

export default function QRScanModal({ onClose }: QRScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // 데스크탑과 모바일 환경 감지
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const startCamera = async () => {
    try {
      setCameraError(null);

      // 데스크탑에서는 전면 카메라, 모바일에서는 후면 카메라 사용
      const facingMode = isMobile() ? "environment" : "user";

      // getUserMedia로 카메라 스트림 획득
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // video 요소에 스트림 할당
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // 비디오 로드 완료 후 재생
        await new Promise((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              resolve(true);
            };
            videoRef.current.onerror = () => {
              reject(new Error("비디오 로드 실패"));
            };
          }
        });

        // 안전한 재생 시도
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn("자동 재생 실패, 사용자 상호작용 필요:", playError);
          // 자동 재생이 실패해도 스트림은 할당되어 있으므로 계속 진행
        }

        setIsScanning(true);
      } else {
        throw new Error("video 요소를 찾을 수 없습니다");
      }
    } catch (error) {
      console.error("카메라 접근 오류:", error);
      setCameraError(
        "카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요."
      );
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={onClose}>
        <X />
      </div>
      <div className={styles.scannerContainer}>
        {/* video 요소를 항상 렌더링 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.video}
          style={{ display: isScanning && !cameraError ? "block" : "none" }}
        />

        {/* 카메라가 작동하지 않을 때만 placeholder 표시 */}
        {(!isScanning || cameraError) && (
          <div className={styles.placeholder}>
            <Image
              src={IMAGES.qrCode}
              alt="QR Code Example"
              width={200}
              height={200}
            />
            <p className={styles.placeholderText}>
              {cameraError || "QR 코드를 프레임 안에 맞춰주세요"}
            </p>
            {cameraError && (
              <button className={styles.retryButton} onClick={startCamera}>
                다시 시도
              </button>
            )}
          </div>
        )}

        {/* 스캐너 프레임 - 항상 표시 */}
        <div className={styles.scannerFrame}>
          <div className={styles.corner} style={{ top: 0, left: 0 }}></div>
          <div className={styles.corner} style={{ top: 0, right: 0 }}></div>
          <div className={styles.corner} style={{ bottom: 0, left: 0 }}></div>
          <div className={styles.corner} style={{ bottom: 0, right: 0 }}></div>
        </div>

        {/* 안내 문구 - 카메라가 작동할 때만 표시 */}
        {isScanning && !cameraError && (
          <div className={styles.overlayText}>
            <Camera color="white" size={30} strokeWidth={1.5} />
            <p>
              QR 코드를 <br />
              프레임 안에 맞춰주세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

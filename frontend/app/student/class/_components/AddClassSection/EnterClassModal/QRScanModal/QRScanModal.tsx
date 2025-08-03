import React, { useEffect, useRef, useState } from "react";
import styles from "./QRScanModal.module.scss";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { inputEntryCode } from "@/api/classes/inputEntryCode";
import AlertModal from "@/components/Modal/AlertModal/AlertModal";
import SetClassNicknameModal from "../../SetClassNicknameModal/SetClassNicknameModal";
import jsQR from "jsqr";

type QRScanModalProps = {
  onClose: () => void;
};

export default function QRScanModal({ onClose }: QRScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSetClassNicknameModalOpen, setIsSetClassNicknameModalOpen] =
    useState(false);
  const [classId, setClassId] = useState("");
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 데스크탑과 모바일 환경 감지
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // QR 코드 감지 처리
  const handleQRCodeDetected = async (entryCode: string) => {
    try {
      const response = await inputEntryCode({ entryCode });

      if (response.isSuccess) {
        setClassId(response.result?.classId || "");
        setIsSetClassNicknameModalOpen(true);
        stopCamera();
      } else {
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error("QR 코드 처리 오류:", error);
      setIsAlertModalOpen(true);
    }
  };

  useEffect(() => {
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

          // QR 코드 스캔 시작 (100ms마다)
          scanIntervalRef.current = setInterval(scanQRCode, 100);
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

    // QR 코드 스캔 함수
    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 비디오 크기에 맞춰 캔버스 크기 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 비디오 프레임을 캔버스에 그리기
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 캔버스에서 이미지 데이터 추출
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // jsQR로 QR 코드 감지
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQRCodeDetected(code.data);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={styles.backButton}
        onClick={() => {
          stopCamera();
          onClose();
        }}
      >
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

        {/* 숨겨진 캔버스 (QR 코드 스캔용) */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

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

      {/* 알림 모달 */}
      {isAlertModalOpen && (
        <AlertModal onClose={() => setIsAlertModalOpen(false)}>
          <p>입장코드가 일치하지 않습니다.</p>
        </AlertModal>
      )}

      {/* 클래스 닉네임 설정 모달 */}
      {isSetClassNicknameModalOpen && (
        <SetClassNicknameModal
          onClose={() => setIsSetClassNicknameModalOpen(false)}
          classId={classId}
        />
      )}
    </div>
  );
}

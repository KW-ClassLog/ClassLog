"use client";

import styles from './page.module.scss';
import React, { ChangeEvent, useEffect, useState } from "react";
import { updateNotificationSetting } from "@/api/notifications/updateNotificationSetting";
import { fetchNotificationSetting } from "@/api/notifications/fetchNotificationSetting";

interface NotiSetting {
  quizUpload: boolean;
  quizAnswerUpload: boolean;
  lectureNoteUpload: boolean;
  lectureUpload: boolean;
  recordUpload: boolean;
}

export default function StudentNotificationSettingPage() {
  const [notiSetting, setNotiSetting] = useState<NotiSetting>({
    quizUpload: false,
    quizAnswerUpload: false,
    lectureNoteUpload: false,
    lectureUpload: false,
    recordUpload: false,
  });

  const handleToggleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target as HTMLInputElement;

    type NotiSettingKey = keyof NotiSetting;
    const key = name as NotiSettingKey;

    // UI 먼저 업데이트
    setNotiSetting((prev) => ({ ...prev, [key]: checked }));

    try {
      const res = await updateNotificationSetting(key, checked);

      if (!res.isSuccess) {
        // 실패 시 롤백
        setNotiSetting((prev) => ({ ...prev, [key]: !checked }));
        console.error("알림 설정 저장 실패:", res.message);
        alert(res.message ?? "알림 설정 저장에 실패했습니다.");
      }
    } catch (err) {
      // 네트워크 오류 시 롤백
      setNotiSetting((prev) => ({ ...prev, [key]: !checked }));
      console.error("알림 설정 저장 에러:", err);
      alert("네트워크 오류로 알림 설정 저장에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetchNotificationSetting();
        if (res.isSuccess && res.result) {
          setNotiSetting(res.result);
        } else {
          console.error("알림 설정 조회 실패", res.message);
        }
      } catch (error) {
        console.error("알림 설정 요청 중 에러 발생", error);
      }
    };

    fetchSetting();
  }, []);

  return (
      <div className={styles.menuList}>

        <div className={styles.toggleMenu}>
          {/* 퀴즈 업로드 알림 */}
          <div className={styles.toggleRow}>
            <span>퀴즈 업로드 알림</span>
            <label className={styles.toggleSwitch}>
              <input
                  type="checkbox"
                  name="quizUpload"
                  checked={notiSetting.quizUpload}
                  onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* 퀴즈 답안 업로드 알림 */}
          <div className={styles.toggleRow}>
            <span>퀴즈 답안 업로드 알림</span>
            <label className={styles.toggleSwitch}>
              <input
                  type="checkbox"
                  name="quizAnswerUpload"
                  checked={notiSetting.quizAnswerUpload}
                  onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* 강의노트 업로드 알림 */}
          <div className={styles.toggleRow}>
            <span>강의노트 업로드 알림</span>
            <label className={styles.toggleSwitch}>
              <input
                  type="checkbox"
                  name="lectureNoteUpload"
                  checked={notiSetting.lectureNoteUpload}
                  onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* 강의 업로드 알림 */}
          <div className={styles.toggleRow}>
            <span>강의 업로드 알림</span>
            <label className={styles.toggleSwitch}>
              <input
                  type="checkbox"
                  name="lectureUpload"
                  checked={notiSetting.lectureUpload}
                  onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* 녹음 업로드 알림 */}
          <div className={styles.toggleRow}>
            <span>녹음 업로드 알림</span>
            <label className={styles.toggleSwitch}>
              <input
                  type="checkbox"
                  name="recordUpload"
                  checked={notiSetting.recordUpload}
                  onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
  );
}

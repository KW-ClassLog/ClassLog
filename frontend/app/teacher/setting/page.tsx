"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { ChangeEvent } from "react";
import { fetchNotificationSetting } from '@/api/notifications/fetchNotificationSetting';


interface NotiSetting {
    quizUpload: boolean;
    quizAnswerUpload: boolean;
    lectureNoteUpload: boolean;
    lectureUpload: boolean;
    recordUpload: boolean;
}


export default function TeacherSettingPage() {
    const router = useRouter();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const [notiSetting, setNotiSetting] = useState<NotiSetting>({
        quizUpload: false,
        quizAnswerUpload: false,
        lectureNoteUpload: false,
        lectureUpload: false,
        recordUpload: false,
    });

    const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotiSetting(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const res = await fetchNotificationSetting();
                if (res.isSuccess && res.result) {
                    setNotiSetting(res.result);
                } else {
                    console.error('알림 설정 조회 실패', res.message);
                }
            } catch (error) {
                console.error('알림 설정 요청 중 에러 발생', error);
            }
        };

        fetchSetting();
    }, []);


    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <ChevronLeft size={24} />
                </button>
                프로필
            </header>
            <div className={styles.profileCard}>
                <img
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    alt="프로필 사진"
                    className={styles.avatar}
                />
                <div className={styles.profileInfo}>
                    <p className={styles.name}>손아현</p>
                    <p className={styles.role}>학생</p>
                </div>
                <ChevronRight color="white" />
            </div>

            <div className={styles.menuList}>
                <div className={styles.menuItemWithArrow} onClick={toggleNotification}>
                    <span>알림 설정</span>
                    <ChevronDown className={`${styles.arrow} ${isNotificationOpen ? styles.open : ''}`} />
                </div>

                {isNotificationOpen && (
                    <div className={`${styles.toggleMenu} ${styles.slideDown}`}>

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
                )}


                <div className={styles.menuItem}>
                    로그아웃
                </div>
            </div>
        </div>
    );
}
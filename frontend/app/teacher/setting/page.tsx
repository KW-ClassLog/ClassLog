"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { ChangeEvent } from "react";
import { fetchNotificationSetting } from '@/api/notifications/fetchNotificationSetting';
import { updateNotificationSetting } from '@/api/notifications/updateNotificationSetting';
import { getProfile } from '@/api/users/getProfile';
import { GetProfileResult } from '@/types/users/getProfileTypes';
import { IMAGES } from '@/constants/images';

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

    const [userProfile, setUserProfile] = useState<GetProfileResult | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoadingProfile(true);
                const response = await getProfile();
                if (response.isSuccess && response.result) {
                    setUserProfile(response.result);
                }
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleToggleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target as HTMLInputElement;

        // 타입 안전을 위해 key 좁히기
        type NotiSettingKey = keyof NotiSetting;
        const key = name as NotiSettingKey;

        setNotiSetting(prev => ({ ...prev, [key]: checked }));

        try {
            const res = await updateNotificationSetting(key, checked);
            if (!res.isSuccess) {
                setNotiSetting(prev => ({ ...prev, [key]: !checked }));
                console.error('알림 설정 저장 실패:', res.message);
                alert(res.message ?? '알림 설정 저장에 실패했습니다.');
            }
        } catch (err) {
            // 4) 네트워크/예외 발생 시 롤백
            setNotiSetting(prev => ({ ...prev, [key]: !checked }));
            console.error('알림 설정 저장 에러:', err);
            alert('네트워크 오류로 알림 설정 저장에 실패했습니다.');
        }
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
                    <ChevronLeft size={24}/>
                </button>
                프로필
            </header>
            <div className={styles.profileCard}>
                <Image
                    src={userProfile?.profile || IMAGES.defaultProfile}
                    alt="프로필 사진"
                    className={styles.avatar}
                    width={50}
                    height={50}
                />
                <div className={styles.profileInfo}>
                    <p className={styles.name}>
                        {isLoadingProfile ? "로딩 중..." : userProfile?.name ?? "사용자"}
                    </p>
                    <p className={styles.role}>
                        {isLoadingProfile ? "" : userProfile?.organization ?? "기관"}
                    </p>
                </div>
                <ChevronRight color="white"/>
            </div>

            <div className={styles.menuList}>
                <div className={styles.menuItemWithArrow} onClick={toggleNotification}>
                    <span>알림 설정</span>
                    <ChevronDown className={`${styles.arrow} ${isNotificationOpen ? styles.open : ''}`}/>
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
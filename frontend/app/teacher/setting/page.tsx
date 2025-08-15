"use client";

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'; 

export default function TeacherSettingPage() {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotificationEnabled(event.target.checked);
  };

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
            <label>알림 허용</label>
            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={isNotificationEnabled}
                onChange={handleToggleChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        )}

        <div className={styles.menuItem}>
          로그아웃
        </div>
      </div>
    </div>
  );
}
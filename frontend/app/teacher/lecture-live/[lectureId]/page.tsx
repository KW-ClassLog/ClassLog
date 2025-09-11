"use client";

import style from "./page.module.scss";
import LectureMainGrid from "./_components/LectureMainGrid/LectureMainGrid";
import { LectureLiveProvider } from "./_components/LectureLiveProvider";
import LiveTopHeader from "./_components/LectureLiveHeader/LectureLiveHeader";
import StartRecordingPrompt from "./_components/Recording/StartRecordingPrompt/StartRecordingPrompt";

export default function TeacherLectureLivePage() {

  return (
    <div className={style.lectureLivePage}>
      <LectureLiveProvider>
        <StartRecordingPrompt />
        <LiveTopHeader />
        <LectureMainGrid />
      </LectureLiveProvider>

    </div>
  );
}
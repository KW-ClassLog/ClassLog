import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import { LectureStatus } from "@/types/lectures/fetchLectureDetailTypes";

interface UseLectureStatusActionProps {
  status: LectureStatus;
  lectureId: string;
  lectureDate?: string;
  onStartLecture?: () => void;
  setShowQuizModal?: (show: boolean) => void;
}

interface ActionButtonConfig {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ComponentType<{ size?: number }>;
}

export const useLectureStatusAction = ({
  status,
  lectureId,
  lectureDate,
  onStartLecture,
  setShowQuizModal,
}: UseLectureStatusActionProps): ActionButtonConfig | null => {
  const router = useRouter();

  switch (status) {
    case "beforeLecture":
      return {
        text: "강의 전",
        className: "beforeLecture",
      };

    case "onLecture":
      return {
        text: "강의 시작하기",
        onClick: onStartLecture,
        icon: ChevronRight,
      };

    case "makeQuiz":
      return {
        text: "퀴즈 생성하기",
        onClick: () => setShowQuizModal?.(true),
        icon: ChevronRight,
        className: "makeQuiz",
      };

    case "checkDashboard": {
      if (lectureDate) {
        const now = dayjs();
        const lectureDateObj = dayjs(lectureDate, "YYYY-MM-DD");
        const isToday = now.isSame(lectureDateObj, "day");
        const midnight = lectureDateObj.add(1, "day").startOf("day");
        const isBeforeMidnight = now.isBefore(midnight);

        // 아직 자정 전이라면 -> "퀴즈 확인하기"
        if (isToday && isBeforeMidnight) {
          return {
            text: "퀴즈 확인하기",
            onClick: () => router.push(ROUTES.teacherQuizList(lectureId)),
            icon: ChevronRight,
            className: "checkQuiz",
          };
        }
      }

      // 자정 이후 -> "대시보드 확인하기"
      return {
        text: "대시보드 확인하기",
        onClick: () => router.push(ROUTES.teacherQuizDashboard(lectureId)),
        icon: ChevronRight,
        className: "checkDashboard",
      };
    }

    default:
      return null;
  }
};
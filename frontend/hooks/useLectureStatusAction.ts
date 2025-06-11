import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";

export type LectureStatus =
  | "beforeLecture"
  | "onLecture"
  | "makeQuiz"
  | "checkDashboard";

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

        if (isToday && isBeforeMidnight) {
          return {
            text: "오늘 밤 12:00 확인 가능",
            disabled: true,
            className: "showDashboardNotYet",
          };
        }
      }

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

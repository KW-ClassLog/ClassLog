"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface LectureDetailContextType {
  lectureId: string;
  classId: string | null;
  setClassId: (classId: string) => void;
}

const LectureDetailContext = createContext<
  LectureDetailContextType | undefined
>(undefined);

interface LectureDetailProviderProps {
  children: ReactNode;
  lectureId: string;
}

export function LectureDetailProvider({
  children,
  lectureId,
}: LectureDetailProviderProps) {
  const [classId, setClassId] = useState<string | null>(null);

  return (
    <LectureDetailContext.Provider value={{ lectureId, classId, setClassId }}>
      {children}
    </LectureDetailContext.Provider>
  );
}

export function useLectureDetail() {
  const context = useContext(LectureDetailContext);
  if (context === undefined) {
    throw new Error(
      "useLectureDetail must be used within a LectureDetailProvider"
    );
  }
  return context;
}

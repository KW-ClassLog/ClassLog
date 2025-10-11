/**
 * 파일 다운로드 유틸리티 함수
 * @param url - 다운로드할 파일의 URL
 * @param fileName - 다운로드될 파일명 (기본값: "파일")
 * @returns Promise<void>
 */
export const downloadFile = async (
  url: string,
  fileName: string = "파일"
): Promise<void> => {
  if (!url) {
    throw new Error("다운로드 URL이 제공되지 않았습니다.");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`다운로드에 실패했습니다. (${response.status})`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("파일 다운로드 실패:", error);
    throw error;
  }
};

/**
 * 파일 다운로드 함수 (에러 처리 포함)
 * @param url - 다운로드할 파일의 URL
 * @param fileName - 다운로드될 파일명 (기본값: "파일")
 * @param onError - 에러 발생 시 실행할 콜백 함수 (선택사항)
 */
export const downloadFileWithErrorHandling = async (
  url: string,
  fileName: string = "파일",
  onError?: (error: Error) => void
): Promise<void> => {
  try {
    await downloadFile(url, fileName);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "다운로드 중 오류가 발생했습니다.";
    console.error("다운로드 실패:", error);

    if (onError) {
      onError(error instanceof Error ? error : new Error(errorMessage));
    } else {
      alert(errorMessage);
    }
  }
};

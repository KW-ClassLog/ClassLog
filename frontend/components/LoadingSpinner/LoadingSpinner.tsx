import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({ text }: { text?: string | string[] }) => {
  const renderText = () => {
    if (!text) return null;

    if (Array.isArray(text)) {
      return (
        <div className={styles.loadingText}>
          {text.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }

    // 문자열인 경우 줄바꿈 문자로 분리하여 처리
    const lines = text.split("\n");
    if (lines.length === 1) {
      return <p className={styles.loadingText}>{text}</p>;
    }

    return (
      <div className={styles.loadingText}>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.spinnerContainer}>
      <span className={styles.loader}></span>
      {renderText()}
    </div>
  );
};

export default LoadingSpinner;

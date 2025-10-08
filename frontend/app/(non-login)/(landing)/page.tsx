import HeroSection from "./_components/HeroSection";
import Navbar from "./_components/Navbar";
import styles from "./page.module.scss";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <div className={styles.contents}>
        <HeroSection />
      </div>
    </div>
  );
}

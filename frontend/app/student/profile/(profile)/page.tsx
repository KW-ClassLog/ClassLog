import VerticalTopContainer from "@/components/Container/VerticalTopContainer/VerticalTopContainer";
import ProfileSection from "./_components/ProfileSection";
import MenuSection from "./_components/MenuSection";

export default function StudentProfilePage() {
  return (
    <VerticalTopContainer>
      <ProfileSection />
      <MenuSection />
    </VerticalTopContainer>
  );
}

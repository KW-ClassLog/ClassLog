import VerticalTopContainer from "@/components/Container/VerticalTopContainer/VerticalTopContainer";
import AddClassSection from "./_components/AddClassSection/AddClassSection";
import ClassListSection from "./_components/ClassListSection/ClassListSection";

export default function StudentClassPage() {
  return (
    <VerticalTopContainer>
      <AddClassSection />
      <ClassListSection />
    </VerticalTopContainer>
  );
}

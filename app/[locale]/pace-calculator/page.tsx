import Sidebar from "@/components/Sidebar";
import PaceCalculator from "@/components/PaceCalculator";
import { UnitProvider } from "@/app/[locale]/contexts/UnitContext";

export default function Home() {
  return (
    <UnitProvider>
      <Sidebar>
        <PaceCalculator />
      </Sidebar>
    </UnitProvider>
  );
}
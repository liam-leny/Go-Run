import NavBar from "@/components/NavBar";
import PaceCalculator from "@/components/PaceCalculator";
import { UnitProvider } from "@/app/[locale]/contexts/UnitContext";

export default function Home() {
  return (
    <div>
      <UnitProvider>
        <NavBar />
        <PaceCalculator />
      </UnitProvider>
    </div>
  );
}

"use client";

import Sidebar from "@/components/Sidebar";
import { UnitProvider } from "../contexts/UnitContext";
import { TrainingProgram } from "@/components/TrainingProgram/TrainingProgram";

export default function Page() {
  return (
    <UnitProvider>
      <Sidebar>
        <TrainingProgram />
      </Sidebar>
    </UnitProvider>
  );
}

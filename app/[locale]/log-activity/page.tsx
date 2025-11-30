"use client";

import Sidebar from "@/components/Sidebar";
import ActivityForm from "@/components/ActivityForm";
import { UnitProvider } from "../contexts/UnitContext";

export default function Page() {
  return (
    <UnitProvider>
      <Sidebar>
        <ActivityForm />
      </Sidebar>
    </UnitProvider>
  );
}

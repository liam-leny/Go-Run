"use client";

import ActivitiesForm from "@/components/ActivitiesForm";
import React from "react";
import { UnitProvider } from "../contexts/UnitContext";
import NavBar from "@/components/NavBar";

export default function Page() {
  return (
    <div>
      <UnitProvider>
        <NavBar />
        <div className="grid grid-flow-col grid-rows-2 gap-4">
          <ActivitiesForm />
        </div>
      </UnitProvider>
    </div>
  );
}

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
        <ActivitiesForm />
      </UnitProvider>
    </div>
  );
}

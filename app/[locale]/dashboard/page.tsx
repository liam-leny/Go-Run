"use client";

import ActivityForm from "@/components/ActivityForm";
import React from "react";
import { UnitProvider } from "../contexts/UnitContext";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  return (
    <UnitProvider>
      <Sidebar>
        <ActivityForm />
      </Sidebar>
    </UnitProvider>
  );
}

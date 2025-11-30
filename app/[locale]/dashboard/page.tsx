"use client";

import { Dashboard } from "@/components/Dashboard/Dashboard";
import React from "react";
import { UnitProvider } from "../contexts/UnitContext";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  return (
    <UnitProvider>
      <Sidebar>
        <Dashboard />
      </Sidebar>
    </UnitProvider>
  );
}

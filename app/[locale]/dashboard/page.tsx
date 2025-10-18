"use client";

import ActivityForm from "@/components/ActivityForm";
import React from "react";
import { UnitProvider } from "../contexts/UnitContext";
import NavBar from "@/components/NavBar";

export default function Page() {
  return (
    <div>
      <UnitProvider>
        <NavBar />
        <ActivityForm />
      </UnitProvider>
    </div>
  );
}

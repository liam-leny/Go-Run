"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface UnitContextType {
  unit: "km" | "miles"; 
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<"km" | "miles">("km");

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "km" ? "miles" : "km"));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
}

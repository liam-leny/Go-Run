"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Unit = "km" | "mi";

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);
const STORAGE_KEY = "go-run-unit";

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>("km");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUnit = window.localStorage.getItem(STORAGE_KEY);
   if (storedUnit === "km" || storedUnit === "mi") {
      setUnit(storedUnit);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    window.localStorage.setItem(STORAGE_KEY, unit);
  }, [unit, isInitialized]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "km" ? "mi" : "km"));
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { ActivityFormValues } from "@/lib/activity.schema";
import { convertToKilometers } from "@/lib/distance";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";

export function useActivitiesData() {
  // Stores distances in kilometric units only
  const [data, setData] = useState<ActivityFormValues[]>([]);
  const { unit } = useUnit();

  useEffect(() => {
    const storedData = localStorage.getItem("runningData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const persist = useCallback((nextData: ActivityFormValues[]) => {
    setData(nextData);
    localStorage.setItem("runningData", JSON.stringify(nextData));
  }, []);

  const addActivity = useCallback(
    (values: ActivityFormValues) => {
      const normalizedValues = {
        ...values,
        distance: convertToKilometers(values.distance, unit),
      };

      persist([...data, normalizedValues]);
    },
    [data, unit, persist]
  );

  const deleteActivity = useCallback(
    (activityId: string) => {
      const filtered = data.filter((_, index) => index.toString() !== activityId);
      persist(filtered);
    },
    [data, persist]
  );

  return { data, addActivity, deleteActivity };
}

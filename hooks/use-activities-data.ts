"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ActivityFormValues, StoredActivity } from "@/lib/activity.schema";
import { convertToKilometers } from "@/lib/distance";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";

export function useActivitiesData() {
  // Stores distances in kilometric units only
  const [data, setData] = useState<StoredActivity[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const isSyncingRef = useRef(false);
  const { unit } = useUnit();

  useEffect(() => {
    const storedData = localStorage.getItem("runningData");
    if (storedData) {
      const parsed = JSON.parse(storedData) as StoredActivity[];
      setData(
        parsed.map((activity) => ({
          ...activity,
          source:
            activity.source ?? (activity.stravaId ? "strava" : "manual"),
          date:
            activity.date instanceof Date
              ? activity.date
              : new Date(activity.date),
        }))
      );
    }
    const storedLastSync = localStorage.getItem("stravaLastSync");
    if (storedLastSync) {
      setLastSyncAt(new Date(storedLastSync));
    }
    setHasLoaded(true);
  }, []);

  const persistNext = useCallback(
    (updater: (prev: StoredActivity[]) => StoredActivity[]) => {
      setData((prev) => {
        const next = updater(prev);
        localStorage.setItem("runningData", JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const addActivity = useCallback(
    (values: ActivityFormValues) => {
      const normalizedValues: StoredActivity = {
        ...values,
        distance: convertToKilometers(values.distance, unit),
        source: "manual",
      };

      persistNext((prev) => [...prev, normalizedValues]);
    },
    [unit, persistNext]
  );

  const deleteActivity = useCallback(
    (activityId: string) => {
      persistNext((prev) =>
        prev.filter((_, index) => index.toString() !== activityId)
      );
    },
    [persistNext]
  );

  const mergeStravaActivities = useCallback(
    (incoming: StoredActivity[]) => {
      persistNext((prev) => {
        const existingIds = new Set(
          prev
            .map((activity) => activity.stravaId)
            .filter((id): id is number => typeof id === "number")
        );

        const normalizedIncoming = incoming.map((activity) => ({
          ...activity,
          source:
            activity.source ?? (activity.stravaId ? "strava" : "manual"),
          date:
            activity.date instanceof Date
              ? activity.date
              : new Date(activity.date),
        }));

        const uniqueIncoming = normalizedIncoming.filter(
          (activity) =>
            typeof activity.stravaId === "number" &&
            !existingIds.has(activity.stravaId)
        );

        if (!uniqueIncoming.length) {
          return prev;
        }

        return [...prev, ...uniqueIncoming];
      });
    },
    [persistNext]
  );

  const syncStravaActivities = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      const statusResponse = await fetch("/api/strava/status", {
        cache: "no-store",
      });
      if (!statusResponse.ok) {
        setIsStravaConnected(false);
        return;
      }

      const status = (await statusResponse.json()) as {
        connected?: boolean;
      };
      const connected = Boolean(status.connected);
      setIsStravaConnected(connected);
      if (!connected) return;

      const response = await fetch("/api/strava/activities", {
        cache: "no-store",
      });
      if (!response.ok) return;

      const activities = (await response.json()) as StoredActivity[];
      mergeStravaActivities(activities);

      const now = new Date();
      setLastSyncAt(now);
      localStorage.setItem("stravaLastSync", now.toISOString());
    } catch {
      // Ignore Strava sync errors for local prototype.
      setIsStravaConnected(false);
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [mergeStravaActivities]);

  useEffect(() => {
    if (!hasLoaded) return;
    syncStravaActivities();
  }, [hasLoaded, syncStravaActivities]);

  return {
    data,
    addActivity,
    deleteActivity,
    syncStravaActivities,
    lastSyncAt,
    isSyncing,
    isStravaConnected,
  };
}

import { NextResponse } from "next/server";
import { StravaClient } from "@/lib/strava/client";
import type { StravaActivity } from "@/lib/strava/types";

export const runtime = "nodejs";

const RUN_TYPES = new Set(["Run", "VirtualRun", "TrailRun", "Treadmill"]);

function toDurationParts(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.max(0, Math.round(totalSeconds % 60));
  return { hours, minutes, seconds };
}

export async function GET() {
  try {
    const client = await StravaClient.fromTokenStore();
    const activities = await client.get<StravaActivity[]>(
      "athlete/activities",
      {
        per_page: 200,
      }
    );

    const mapped = activities
      .filter((activity) => RUN_TYPES.has(activity.type))
      .map((activity) => {
        const totalSeconds = activity.moving_time || activity.elapsed_time;
        const { hours, minutes, seconds } = toDurationParts(totalSeconds);

        return {
          date: new Date(activity.start_date_local || activity.start_date),
          distance: activity.distance / 1000,
          hours,
          minutes,
          seconds,
          source: "strava" as const,
          stravaId: activity.id,
        };
      });

    return NextResponse.json(mapped);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("No Strava tokens") ? 401 : 500;
    return NextResponse.json(
      { error: "Strava activities fetch failed.", details: message },
      { status }
    );
  }
}

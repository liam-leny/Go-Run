"use client";

import { ActivityFormValues } from "@/lib/activity.schema";
import { convertDistance } from "@/lib/distance";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";

type DashboardSummaryProps = {
  data: ActivityFormValues[];
};

export function DashboardSummary({ data }: DashboardSummaryProps) {
  const { unit } = useUnit();
  const t = useTranslations("DashboardSummary");

  const activityCount = data.length;
  const totalDistance = data.reduce(
    (acc, activity) => acc + convertDistance(activity.distance, unit),
    0
  );
  const totalSeconds = data.reduce(
    (acc, { hours, minutes, seconds }) =>
      acc + hours * 3600 + minutes * 60 + seconds,
    0
  );
  const totalTimeDisplay =
    totalSeconds > 0 ? formatDuration(totalSeconds) : "--";
  const averagePace =
    totalDistance > 0 ? formatPace(totalSeconds, totalDistance) : "--";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <SummaryCard
        title={t("totalDistance", { unit })}
        value={`${totalDistance.toFixed(1)} ${unit}`}
      />
      <SummaryCard title={t("totalTime")} value={totalTimeDisplay} />
      <SummaryCard title={t("averagePace", { unit })} value={averagePace} />
      <SummaryCard title={t("activities")} value={activityCount.toString()} />
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
};

const formatPace = (totalSeconds: number, distance: number) => {
  const secondsPerUnit = totalSeconds / distance;
  const paceMinutes = Math.floor(secondsPerUnit / 60);
  const paceSeconds = Math.round(secondsPerUnit % 60);
  const normalizedSeconds = paceSeconds === 60 ? 0 : paceSeconds;
  const normalizedMinutes = paceSeconds === 60 ? paceMinutes + 1 : paceMinutes;

  return `${normalizedMinutes}:${normalizedSeconds
    .toString()
    .padStart(2, "0")}`;
};

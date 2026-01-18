"use client";

import { StoredActivity } from "@/lib/activity.schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLocale, useTranslations } from "next-intl";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import {
  formatDistance,
  formatDuration,
  formatPaceFromSecondsAndDistance,
} from "@/lib/formatters";
import { convertDistance } from "@/lib/distance";

type DashboardSummaryProps = {
  data: StoredActivity[];
};

export function DashboardSummary({ data }: DashboardSummaryProps) {
  const { unit } = useUnit();
  const locale = useLocale();
  const t = useTranslations("DashboardSummary");

  const activityCount = data.length;
  const totalDistanceKm = data.reduce(
    (acc, activity) => acc + activity.distance,
    0
  );
  const totalDistance = convertDistance(totalDistanceKm, unit);
  const totalSeconds = data.reduce(
    (acc, { hours, minutes, seconds }) =>
      acc + hours * 3600 + minutes * 60 + seconds,
    0
  );
  const totalTimeDisplay =
    totalSeconds > 0 ? formatDuration(totalSeconds) : "--";
  const averagePace =
    totalDistance > 0
      ? formatPaceFromSecondsAndDistance(totalSeconds, totalDistance)
      : "--";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <SummaryCard
        title={t("totalDistance", { unit })}
        value={formatDistance(totalDistance, unit, locale)}
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

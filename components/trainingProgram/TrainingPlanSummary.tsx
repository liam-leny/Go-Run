"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import type { TrainingPlan } from "@/lib/training-plan";

type SummaryItem = {
  key: string;
  label: string;
  value: string;
};

type TrainingPlanSummaryProps = {
  plan: TrainingPlan;
  unitLabel: string;
  targetTimeSeconds: number | null;
  formatDistance: (distanceKm: number) => string;
  formatPace: (pacePerKm: number) => string;
  formatDuration: (totalSeconds: number) => string;
};

export function TrainingPlanSummary({
  plan,
  unitLabel,
  targetTimeSeconds,
  formatDistance,
  formatPace,
  formatDuration,
}: TrainingPlanSummaryProps) {
  const t = useTranslations("TrainingProgram");

  const firstWeek = plan.weeks[0];
  const summaryItems: SummaryItem[] = [
    { key: "race", label: t("summary.race"), value: formatPace(plan.pacePerKm) },
    {
      key: "easy",
      label: t("summary.easy"),
      value: formatPace(firstWeek.easyRuns.pacePerKm),
    },
  ];

  if (firstWeek.steadyRun) {
    summaryItems.push({
      key: "steady",
      label: t("summary.steady"),
      value: formatPace(firstWeek.steadyRun.pacePerKm),
    });
  }

  summaryItems.push(
    {
      key: "long",
      label: t("summary.long"),
      value: formatPace(firstWeek.longRun.pacePerKm),
    },
    {
      key: "sessions",
      label: t("summary.sessions"),
      value: t(`frequencyOptions.${plan.sessionsPerWeek}`),
    }
  );

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{t("summaryTitle", { weeks: plan.weeks.length })}</CardTitle>
        <CardDescription>{t("planIntro")}</CardDescription>
        <CardDescription>
          {t("raceReminder", {
            distance: formatDistance(plan.raceDistanceKm),
            unit: unitLabel,
          })}
        </CardDescription>
        {targetTimeSeconds !== null && (
          <CardDescription>
            {t("finishReminder", {
              time: formatDuration(targetTimeSeconds),
            })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm font-medium">{t("summary.heading")}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {summaryItems.map((item) => (
              <div
                key={item.key}
                className="rounded-lg border bg-muted/40 p-4"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

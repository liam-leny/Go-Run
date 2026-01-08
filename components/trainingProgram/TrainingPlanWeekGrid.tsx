"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TrainingPlan } from "@/lib/training-plan";
import { useTranslations } from "next-intl";
import {
  formatDistanceValueFromKm,
  formatPaceFromPerKm,
} from "@/lib/formatters";
import type { Unit } from "@/app/[locale]/contexts/UnitContext";

type TrainingPlanWeekGridProps = {
  plan: TrainingPlan;
  unitLabel: Unit;
  locale: string;
};

export function TrainingPlanWeekGrid({
  plan,
  unitLabel,
  locale,
}: TrainingPlanWeekGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plan.weeks.map((week) => (
        <WeekCard
          key={week.week}
          week={week}
          goal={plan.goal}
          unitLabel={unitLabel}
          locale={locale}
        />
      ))}
    </div>
  );
}

type WeekCardProps = {
  week: TrainingPlan["weeks"][number];
  goal: TrainingPlan["goal"];
  unitLabel: Unit;
  locale: string;
};

function WeekCard({
  week,
  goal,
  unitLabel,
  locale,
}: WeekCardProps) {
  const t = useTranslations("TrainingProgram");
  const distanceLabel = (km: number) =>
    formatDistanceValueFromKm(km, unitLabel, locale);
  const paceLabel = (pacePerKm: number) =>
    formatPaceFromPerKm(pacePerKm, unitLabel);

  const easyDistance = distanceLabel(week.easyRuns.distanceKm);
  const longDistance = distanceLabel(week.longRun.distanceKm);
  const steadyDistance = week.steadyRun
    ? distanceLabel(week.steadyRun.distanceKm)
    : null;
  const easyPace = paceLabel(week.easyRuns.pacePerKm);
  const longPace = paceLabel(week.longRun.pacePerKm);
  const steadyPace = week.steadyRun
    ? paceLabel(week.steadyRun.pacePerKm)
    : null;
  const qualityText = t(`quality.${goal}.${week.qualityKey}`);
  const placementLabel = t(`qualityPlacement.${week.qualityPlacement}`);
  const qualityTag = t("qualityTag");

  const sessionItems = [
    {
      key: "easy",
      text: t("easyRuns", {
        count: week.easyRuns.count,
        distance: easyDistance,
        unit: unitLabel,
        pace: easyPace,
      }),
      highlight: week.qualityPlacement === "easy",
    },
  ];

  if (week.steadyRun && steadyDistance && steadyPace) {
    sessionItems.push({
      key: "steady",
      text: t("steadyRun", {
        distance: steadyDistance,
        unit: unitLabel,
        pace: steadyPace,
      }),
      highlight: week.qualityPlacement === "steady",
    });
  }

  sessionItems.push({
    key: "long",
    text: t("longRun", {
      distance: longDistance,
      unit: unitLabel,
      pace: longPace,
    }),
    highlight: week.qualityPlacement === "long",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("weekLabel", { week: week.week })}</CardTitle>
        <CardDescription>{t(`focus.${week.stage}`)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <ul className="mt-2 space-y-2">
              {sessionItems.map((session) => (
                <li
                  key={session.key}
                  className="rounded-md border border-border/60 bg-muted/40 px-3 py-2"
                >
                  {session.highlight && (
                    <span className="mb-1 inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70"
                        aria-hidden="true"
                      />
                      {qualityTag}
                    </span>
                  )}
                  <p>{session.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t("qualityFocusLabel")}
            </p>
            <p className="mt-1 text-muted-foreground">
              {t("qualitySession", {
                session: qualityText,
                suggestedRun: placementLabel,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

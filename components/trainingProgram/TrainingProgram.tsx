"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";

import { TrainingProgramFormSection } from "./TrainingProgramFormSection";
import { TrainingPlanSummary } from "./TrainingPlanSummary";
import { TrainingPlanWeekGrid } from "./TrainingPlanWeekGrid";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrainingGoal,
  TrainingPlan,
  convertPacePerKmToUnit,
  getRaceDistanceKm,
  generateTrainingPlan,
} from "@/lib/training-plan";
import { convertDistance } from "@/lib/distance";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import {
  getTrainingProgramSchema,
  type TrainingProgramFormValues,
} from "@/lib/training-program.schema";

export function TrainingProgram() {
  const t = useTranslations("TrainingProgram");
  const tZod = useTranslations("zod");
  const locale = useLocale();
  const { unit } = useUnit();

  const form = useForm<TrainingProgramFormValues>({
    resolver: zodResolver(getTrainingProgramSchema({ tZod })),
    defaultValues: {
      goal: "5k",
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      sessionsPerWeek: 5,
    },
  });

  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [targetTimeSeconds, setTargetTimeSeconds] = useState<number | null>(
    null
  );

  const goal = (form.watch("goal") ?? "5k") as TrainingGoal;
  const goalDistanceKm = getRaceDistanceKm(goal);

  const formatDistance = (distanceKm: number) => {
    const converted = convertDistance(distanceKm, unit);
    const rounded = Math.round(converted * 10) / 10;
    const isInteger = Math.abs(rounded - Math.round(rounded)) < Number.EPSILON;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: isInteger ? 0 : 1,
      maximumFractionDigits: isInteger ? 0 : 1,
    }).format(rounded);
  };

  const formatPace = (pacePerKm: number) => {
    const pace = convertPacePerKmToUnit(pacePerKm, unit);
    const totalSeconds = Math.max(0, Math.round(pace * 60));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDuration = (totalSeconds: number) => {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (values: TrainingProgramFormValues) => {
    const totalSeconds = Math.round(
      values.hours * 3600 + values.minutes * 60 + values.seconds
    );
    const totalMinutes = totalSeconds / 60;
    const raceDistanceKm = getRaceDistanceKm(values.goal);
    const pacePerKm = totalMinutes / raceDistanceKm;
    const generatedPlan = generateTrainingPlan(values.goal, pacePerKm, {
      sessionsPerWeek: values.sessionsPerWeek,
    });

    setPlan(generatedPlan);
    setTargetTimeSeconds(totalSeconds);
  };

  const handleReset = () => {
    form.reset({
      goal: "5k",
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      sessionsPerWeek: 5,
    });
    setPlan(null);
    setTargetTimeSeconds(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6">
      <TrainingProgramFormSection
        form={form}
        onSubmit={handleSubmit}
        onReset={handleReset}
        showReset={Boolean(plan)}
        goalDistanceKm={goalDistanceKm}
        unitLabel={unit}
        formatDistance={formatDistance}
      />

      {plan ? (
        <>
          <TrainingPlanSummary
            plan={plan}
            unitLabel={unit}
            targetTimeSeconds={targetTimeSeconds}
            formatDistance={formatDistance}
            formatPace={formatPace}
            formatDuration={formatDuration}
          />
          <TrainingPlanWeekGrid
            plan={plan}
            unitLabel={unit}
            formatDistance={formatDistance}
            formatPace={formatPace}
          />
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {t("noPlan")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

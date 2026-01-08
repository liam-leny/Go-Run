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
  getRaceDistanceKm,
  generateTrainingPlan,
} from "@/lib/training-plan";
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
      />

      {plan ? (
        <>
          <TrainingPlanSummary
            plan={plan}
            unitLabel={unit}
            locale={locale}
            targetTimeSeconds={targetTimeSeconds}
          />
          <TrainingPlanWeekGrid
            plan={plan}
            unitLabel={unit}
            locale={locale}
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

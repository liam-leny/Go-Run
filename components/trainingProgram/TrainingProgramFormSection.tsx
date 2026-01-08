"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRAINING_GOALS, type TrainingGoal } from "@/lib/training-plan";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import type { TrainingProgramFormValues } from "@/lib/training-program.schema";
import { formatDistanceValueFromKm } from "@/lib/formatters";
import type { Unit } from "@/app/[locale]/contexts/UnitContext";

const WEEKLY_SESSION_OPTIONS = [4, 5, 6] as const;

type TrainingProgramFormSectionProps = {
  form: UseFormReturn<TrainingProgramFormValues>;
  onSubmit: (values: TrainingProgramFormValues) => void;
  onReset: () => void;
  showReset: boolean;
  goalDistanceKm: number;
  unitLabel: Unit;
};

export function TrainingProgramFormSection({
  form,
  onSubmit,
  onReset,
  showReset,
  goalDistanceKm,
  unitLabel,
}: TrainingProgramFormSectionProps) {
  const t = useTranslations("TrainingProgram");
  const locale = useLocale();

  const goalOptions = TRAINING_GOALS.map((goal) => ({
    value: goal,
    label: t(`goals.${goal as TrainingGoal}`),
  }));

  const frequencyOptions = WEEKLY_SESSION_OPTIONS.map((value) => ({
    value,
    label: t(`frequencyOptions.${value}`),
  }));

  const timeHelper = t("timeHelper", {
    distance: formatDistanceValueFromKm(goalDistanceKm, unitLabel, locale),
    unit: unitLabel,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("goalLabel")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("goalPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {goalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionsPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("frequencyLabel")}</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>{t("frequencyHelper")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("hours")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="0"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("minutes")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="0"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("seconds")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      placeholder="0"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className="text-sm text-muted-foreground">{timeHelper}</p>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">{t("generate")}</Button>
            {showReset && (
              <Button type="button" variant="outline" onClick={onReset}>
                {t("reset")}
              </Button>
            )}
          </div>
        </form>
      </Form>
      </CardContent>
    </Card>
  );
}

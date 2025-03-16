"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { useTranslations } from "next-intl";
import {
  getPaceCalculatorSchema,
  PaceCalculatorFormValues,
} from "@/lib/pace-calculator.schema";

export default function PaceCalculator() {
  const t = useTranslations("PaceCalculator");
  const tZod = useTranslations("zod");
  const [paceResult, setPaceResult] = useState<string | null>(null);
  const { unit } = useUnit();

  const form = useForm<PaceCalculatorFormValues>({
    resolver: zodResolver(getPaceCalculatorSchema(tZod)),
  });

  function onSubmit(values: PaceCalculatorFormValues) {
    const { distance, hours, minutes, seconds } = values;

    const totalMinutes = hours * 60 + minutes + seconds / 60;

    const pace = totalMinutes / distance;

    const paceMinutes = Math.floor(pace);
    const paceSeconds = Math.round((pace - paceMinutes) * 60);

    setPaceResult(`${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}`);
  }

  return (
    <div className="mt-16 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("distance")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={unit === "km" ? "10" : t("miles_placeholder")}
                    min={0}
                    step={"any"}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  {t("distance_description")}
                  {unit === "km" ? t("km") : t("miles")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel> {t("hours")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    min={0}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>{t("hours_description")} </FormDescription>
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
                    placeholder="58"
                    min={0}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>{t("minutes_description")}</FormDescription>
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
                    placeholder="23"
                    min={0}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>{t("seconds_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t("calculate")}
          </Button>
        </form>
      </Form>

      {paceResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="font-semibold">
            {t("pace")}
            {paceResult}
            {unit === "km" ? "/km" : "/mile"}
          </p>
        </div>
      )}
    </div>
  );
}

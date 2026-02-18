"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { format, startOfMonth, startOfWeek } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StoredActivity } from "@/lib/activity.schema";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { convertDistance } from "@/lib/distance";

type DistanceVolumeChartProps = {
  data: StoredActivity[];
};

type AggregationMode = "week" | "month";

type AggregatedDistance = {
  periodStart: string;
  distance: number;
};

const chartColor = "hsl(var(--chart-2))";

export default function DistanceVolumeChart({ data }: DistanceVolumeChartProps) {
  const t = useTranslations("DistanceVolume");
  const locale = useLocale();
  const { unit } = useUnit();
  const [mode, setMode] = React.useState<AggregationMode>("week");

  const chartConfig = {
    distance: {
      label: t("distanceLabel", { unit }),
      color: chartColor,
    },
  } as const;

  const chartData = React.useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filtered = data.filter(
      (activity) => new Date(activity.date) >= oneYearAgo
    );

    const grouped = filtered.reduce<Record<string, AggregatedDistance>>(
      (acc, activity) => {
        const date = new Date(activity.date);
        const periodDate =
          mode === "week"
            ? startOfWeek(date, { weekStartsOn: 1 })
            : startOfMonth(date);
        const key = periodDate.toISOString();

        if (!acc[key]) {
          acc[key] = {
            periodStart: key,
            distance: 0,
          };
        }

        acc[key].distance += convertDistance(activity.distance, unit);
        return acc;
      },
      {}
    );

    return Object.values(grouped)
      .map((entry) => ({
        ...entry,
        distance: Number(entry.distance.toFixed(2)),
      }))
      .sort(
        (a, b) =>
          new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime()
      );
  }, [data, mode, unit]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <div className="flex rounded-lg border p-1">
          <button
            type="button"
            data-active={mode === "week"}
            className="rounded-md px-3 py-1.5 text-sm data-[active=true]:bg-muted"
            onClick={() => setMode("week")}
          >
            {t("weekly")}
          </button>
          <button
            type="button"
            data-active={mode === "month"}
            className="rounded-md px-3 py-1.5 text-sm data-[active=true]:bg-muted"
            onClick={() => setMode("month")}
          >
            {t("monthly")}
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="periodStart"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) => {
                const date = new Date(value);
                return mode === "week"
                  ? format(date, locale === "fr" ? "dd/MM" : "MM/dd")
                  : format(date, locale === "fr" ? "MMM yyyy" : "MMM yyyy");
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="distance"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return mode === "week"
                      ? t("weekOf", {
                          date: date.toLocaleDateString(
                            locale === "fr" ? "fr-FR" : "en-GB",
                            { month: "short", day: "numeric", year: "numeric" }
                          ),
                        })
                      : date.toLocaleDateString(
                          locale === "fr" ? "fr-FR" : "en-GB",
                          { month: "long", year: "numeric" }
                        );
                  }}
                />
              }
            />
            <Bar dataKey="distance" fill={chartColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

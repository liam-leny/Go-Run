"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { ActivityFormValues } from "@/lib/activity.schema";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { useTranslations, useLocale } from "next-intl";
import { convertDistance } from "@/lib/distance";

interface StatsChartProps {
  data: ActivityFormValues[];
}

export default function StatsChart({ data }: StatsChartProps) {
  const { unit } = useUnit();
  const t = useTranslations("StatsChart");
  const localeCode = useLocale();

  const chartConfig = {
    distance: {
      label: `${t("distance")} (${unit})`,
      color: "hsl(var(--chart-1))",
    },
    time: {
      label: `${t("time")} (h)`,
      color: "hsl(var(--chart-2))",
    },
  } as const;

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("distance");

  // Filter activities within the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const filteredData = data.filter(
    (activity) => new Date(activity.date) >= threeMonthsAgo
  );

  // Aggregate data by date
  const aggregatedData = Object.values(
    filteredData.reduce((acc, curr) => {
      const dateKey = curr.date.toString();

      // If the date does not exist in the accumulator, create an entry
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          distance: 0,
          time: 0,
        };
      }

      // Sum up the distances (converted if needed) and time values
      acc[dateKey].distance += convertDistance(curr.distance, unit);
      acc[dateKey].time += curr.hours + curr.minutes / 60 + curr.seconds / 3600;

      return acc;
    }, {} as Record<string, { date: string; distance: number; time: number }>)
  )
    .map((item) => ({
      ...item,
      distance: parseFloat(item.distance.toFixed(2)),
      time: parseFloat(item.time.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by chronological order

  const total = React.useMemo(
    () => ({
      distance: aggregatedData.reduce((acc, curr) => acc + curr.distance, 0),
      time: aggregatedData.reduce((acc, curr) => acc + curr.time, 0),
    }),
    [aggregatedData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{t("title")} </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <div className="flex">
          {["distance", "time"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={aggregatedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(
                  localeCode === "fr" ? "fr-FR" : "en-GB",
                  {
                    month: "short",
                    day: "numeric",
                  }
                );
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(
                      localeCode === "fr" ? "fr-FR" : "en-GB",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

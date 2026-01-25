"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useLocale, useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StoredActivity } from "@/lib/activity.schema";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { convertDistance } from "@/lib/distance";
import { formatDuration } from "@/lib/formatters";
import { useIsMobile } from "@/hooks/use-mobile";

type PaceTrendChartProps = {
  data: StoredActivity[];
};

export default function PaceTrendChart({ data }: PaceTrendChartProps) {
  const t = useTranslations("PaceTrend");
  const { unit } = useUnit();
  const locale = useLocale();
  const isMobile = useIsMobile();

  const lineColor = "hsl(var(--chart-1))";
  const chartConfig = {
    pace: {
      label: t("paceLabel", { unit }),
      color: lineColor,
    },
  } as const;

  const chartData = React.useMemo(() => {
    const normalized = data
      .map((activity) => {
        const distance = convertDistance(activity.distance, unit);
        const totalSeconds =
          activity.hours * 3600 + activity.minutes * 60 + activity.seconds;

        if (!distance || totalSeconds <= 0) return null;

        return {
          date: activity.date.toISOString(),
          paceSeconds: totalSeconds / Math.max(distance, 0.0001),
        };
      })
      .filter(
        (item): item is { date: string; paceSeconds: number } => item !== null
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (!isMobile) return normalized;

    const maxPoints = 30;
    if (normalized.length <= maxPoints) return normalized;

    const step = Math.ceil(normalized.length / maxPoints);
    const sampled = normalized.filter((_, index) => index % step === 0);
    const last = normalized[normalized.length - 1];
    if (sampled[sampled.length - 1]?.date !== last.date) {
      sampled.push(last);
    }

    return sampled;
  }, [data, unit, isMobile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-GB",
                  { month: "short", day: "numeric" }
                )
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value) => formatDuration(Number(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-GB",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                  }
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-muted-foreground">
                        {chartConfig.pace.label}
                      </span>
                      <span className="font-mono font-medium">
                        {formatDuration(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="paceSeconds"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 3, fill: lineColor, stroke: lineColor }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

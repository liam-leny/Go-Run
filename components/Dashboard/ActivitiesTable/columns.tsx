"use client";

import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { StoredActivity } from "@/lib/activity.schema";
import { convertDistance } from "@/lib/distance";
import { calculatePace } from "@/lib/pace";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "../../ui/button";

type DataTableColumn<TData> = ColumnDef<TData, unknown> & {
  meta?: { className?: string };
};
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const formatDate = (date: Date, localeCode: string) => {
  const locales = { fr, en: enGB };
  const locale = locales[localeCode as keyof typeof locales] || enGB;

  return format(date, "dd/MM/yyyy", { locale });
};

export function useColumns(
  handleDelete: (id: string) => void
): DataTableColumn<StoredActivity>[] {
  const t = useTranslations("ActivitiesTable");
  const { unit } = useUnit();
  const localeCode = useLocale();

  return [
    {
      accessorKey: "date",
      meta: { className: "w-32" },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.original.date;
        return formatDate(date, localeCode);
      },
    },
    {
      accessorKey: "distance",
      meta: { className: "w-42" },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`${t("distance")} (${unit})`}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const distanceInKm: number = row.original.distance;
        return convertDistance(distanceInKm, unit).toFixed(2);
      },
    },
    {
      accessorKey: "time",
      meta: { className: "w-32 whitespace-nowrap" },
      header: t("time"),
      cell: ({ row }) => {
        const { hours, minutes, seconds } = row.original;
        const segments = [];
        if (hours > 0) segments.push(`${hours}h`);
        if (minutes > 0) segments.push(`${minutes}m`);
        if (seconds > 0) segments.push(`${seconds}s`);
        return segments.length ? segments.join(" ") : "0s";
      },
    },
    {
      accessorKey: "pace",
      meta: { className: "w-32 whitespace-nowrap" },
      header: `${t("pace")} (min/${unit})`,
      cell: ({ row }) => {
        const { distance, hours, minutes, seconds } = row.original;
        const distanceInUnit = convertDistance(distance, unit);

        return calculatePace({
          distance: distanceInUnit,
          hours,
          minutes,
          seconds,
        });
      },
    },
    {
      accessorKey: "source",
      meta: { className: "w-28" },
      header: t("source"),
      cell: ({ row }) => {
        const source = row.original.source === "strava" ? "strava" : "manual";
        const label =
          source === "strava" ? t("source_strava") : t("source_manual");
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
              source === "strava"
                ? "border-[#FC5200]/30 bg-[#FC5200]/10 text-[#FC5200]"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {label}
          </span>
        );
      },
    },
    {
      id: "actions",
      meta: { className: "w-16 text-right" },
      cell: ({ row }) => {
        const activityId = row.index.toString();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(activityId)}>
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

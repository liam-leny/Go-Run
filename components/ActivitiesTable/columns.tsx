"use client";

import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { ActivitiesFormValues } from "@/lib/run-activities.schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const convertDistance = (distanceInKm: number, unit: string) => {
  return unit === "miles" ? distanceInKm / 1.609344 : distanceInKm;
};

const computePace = (
  distanceinKm: number,
  unit: string,
  hours: number,
  minutes: number,
  seconds: number
) => {
  const distance = convertDistance(distanceinKm, unit);
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  const pace = totalMinutes / distance;

  const paceMinutes = Math.floor(pace);
  const paceSeconds = Math.round((pace - paceMinutes) * 60);

  return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}`;
};

const formatDate = (date: Date, localeCode: string) => {
  const locales = { fr, en: enGB };
  const locale = locales[localeCode as keyof typeof locales] || enGB;

  return format(date, "dd/MM/yyyy", { locale });
};

export function useColumns(
  handleDelete: (id: string) => void
): ColumnDef<ActivitiesFormValues>[] {
  const t = useTranslations("ActivitiesTable");
  const { unit } = useUnit();
  const localeCode = useLocale();

  return [
    {
      accessorKey: "date",
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
      header: t("time"),
      cell: ({ row }) => {
        const { hours, minutes, seconds } = row.original;
        return [
          hours > 0 ? `${hours}h ` : "",
          minutes > 0 ? `${minutes}m ` : "",
          seconds > 0 ? `${seconds} s ` : "",
        ];
      },
    },
    {
      accessorKey: "pace",
      header: `${t("pace")} (min/${unit === "km" ? "km" : "mile"})`,
      cell: ({ row }) => {
        const { distance, hours, minutes, seconds } = row.original;
        return computePace(distance, unit, hours, minutes, seconds);
      },
    },
    {
      id: "actions",
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

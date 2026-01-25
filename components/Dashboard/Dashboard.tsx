"use client";

import { ActivitiesTable } from "./ActivitiesTable/data-table";
import { useColumns } from "./ActivitiesTable/columns";
import StatsChart from "./StatsChart";
import PaceTrendChart from "./PaceTrendChart";
import { useActivitiesData } from "@/hooks/use-activities-data";
import { DashboardSummary } from "./DashboardSummary";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

export function Dashboard() {
  const {
    data,
    deleteActivity,
    syncStravaActivities,
    lastSyncAt,
    isSyncing,
    isStravaConnected,
  } = useActivitiesData();
  const columns = useColumns(deleteActivity);
  const t = useTranslations("StravaSync");
  const locale = useLocale();
  const lastSyncLabel = lastSyncAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(lastSyncAt)
    : t("never");

  return (
    <div className="flex flex-col gap-8">
      <DashboardSummary data={data} />
      {isStravaConnected && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {t("lastSync")}{" "}
            <span className="font-medium text-foreground">{lastSyncLabel}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={syncStravaActivities}
            disabled={isSyncing}
          >
            {isSyncing ? t("syncing") : t("sync")}
          </Button>
        </div>
      )}
      <ActivitiesTable columns={columns} data={data} />
      <StatsChart data={data} />
      <PaceTrendChart data={data} />
    </div>
  );
}

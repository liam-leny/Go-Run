"use client";

import { ActivitiesTable } from "./ActivitiesTable/data-table";
import { useColumns } from "./ActivitiesTable/columns";
import StatsChart from "./StatsChart";
import { useActivitiesData } from "@/hooks/use-activities-data";
import { DashboardSummary } from "./DashboardSummary";

export function Dashboard() {
  const { data, deleteActivity } = useActivitiesData();
  const columns = useColumns(deleteActivity);

  return (
    <div className="flex flex-col gap-8">
      <DashboardSummary data={data} />
      <ActivitiesTable columns={columns} data={data} />
      <StatsChart data={data} />
    </div>
  );
}

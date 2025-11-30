"use client";

import { ActivitiesTable } from "./ActivitiesTable/data-table";
import { useColumns } from "./ActivitiesTable/columns";
import StatsChart from "./StatsChart";
import { useActivitiesData } from "@/hooks/use-activities-data";

export function Dashboard() {
  const { data, deleteActivity } = useActivitiesData();
  const columns = useColumns(deleteActivity);

  return (
    <div className="flex flex-col gap-8">
      <ActivitiesTable columns={columns} data={data} />
      <StatsChart data={data} />
    </div>
  );
}

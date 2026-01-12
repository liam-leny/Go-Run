"use client";

import Sidebar from "@/components/Sidebar";
import ActivityForm from "@/components/ActivityForm";
import { UnitProvider } from "../contexts/UnitContext";
import { Separator } from "@/components/ui/separator";
import StravaConnectButton from "@/components/StravaConnectButton";

export default function Page() {
  return (
    <UnitProvider>
      <Sidebar>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <StravaConnectButton />
          <div className="hidden md:flex h-96 items-center">
            <Separator orientation="vertical" />
          </div>
          <div className="flex md:hidden w-full items-center">
            <Separator />
          </div>
          <div className="flex-1">
            <ActivityForm />
          </div>
        </div>
      </Sidebar>
    </UnitProvider>
  );
}

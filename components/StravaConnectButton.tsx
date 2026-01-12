"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type StravaConnectButtonProps = {
  className?: string;
};

export default function StravaConnectButton({
  className,
}: StravaConnectButtonProps) {
  const t = useTranslations("ActivityForm");
  const searchParams = useSearchParams();
  const connectedFromQuery = useMemo(
    () => searchParams?.get("strava") === "connected",
    [searchParams]
  );
  const [isConnected, setIsConnected] = useState(connectedFromQuery);

  useEffect(() => {
    if (connectedFromQuery) {
      setIsConnected(true);
      return;
    }

    let isActive = true;
    fetch("/api/strava/status", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Status request failed");
        }
        return res.json() as Promise<{ connected: boolean }>;
      })
      .then((data) => {
        if (isActive) {
          setIsConnected(Boolean(data.connected));
        }
      })
      .catch(() => {
        if (isActive) {
          setIsConnected(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [connectedFromQuery]);

  const label = isConnected ? t("connected_strava") : t("connect_strava");

  const handleConnect = () => {
    if (isConnected) return;
    window.location.href = "/api/strava/connect";
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "group h-11 w-64 gap-2 rounded-full border border-[#FC5200]/40 bg-white text-[#FC5200] shadow-[0_8px_24px_-18px_rgba(252,82,0,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FC5200] hover:bg-[#FC5200] hover:text-white hover:shadow-[0_14px_30px_-18px_rgba(252,82,0,0.75)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
      onClick={handleConnect}
      disabled={isConnected}
    >
      <span>{label}</span>
      <Image
        src="/strava.svg"
        alt="Strava logo"
        width={20}
        height={20}
        className="h-4 w-auto transition duration-200 group-hover:brightness-0 group-hover:invert group-disabled:brightness-100 group-disabled:invert-0"
      />
    </Button>
  );
}

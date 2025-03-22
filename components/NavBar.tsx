"use client";

import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import Link from "next/link";

export default function NavBar() {
  const t = useTranslations("NavBar");
  const { unit, toggleUnit } = useUnit();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link className="text-xl font-bold" href="/">
        Go Run
      </Link>
      <Link href="/dashboard">Dashboard</Link>
      <div className="flex items-center gap-2">
        <Button variant={"secondary"} onClick={toggleUnit} className="w-40">
          {unit === "km" ? t("miles") : t("km")}
        </Button>
        <LocaleSwitcher />
      </div>
    </nav>
  );
}

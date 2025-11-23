"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { Dumbbell, Gauge, LayoutDashboard } from "lucide-react";

import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  children: React.ReactNode;
};

type NavigationItem = {
  href: string;
  labelKey: "paceCalculator" | "dashboard" | "trainingProgram";
  icon: LucideIcon;
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: "/", labelKey: "paceCalculator", icon: Gauge },
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/training-program", labelKey: "trainingProgram", icon: Dumbbell },
];

const normalizePathname = (pathname: string, locale: string) => {
  const localePrefix = `/${locale}`;
  if (pathname === localePrefix || pathname === `${localePrefix}/`) {
    return "/";
  }
  if (pathname.startsWith(`${localePrefix}/`)) {
    return pathname.slice(localePrefix.length);
  }
  return pathname;
};

export default function Sidebar({ children }: SidebarProps) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = useLocale();
  const { unit, toggleUnit } = useUnit();

  const currentPath = React.useMemo(() => {
    if (!pathname) return "/";
    return normalizePathname(pathname, locale);
  }, [pathname, locale]);

  const navigationItems = React.useMemo(
    () =>
      NAVIGATION_ITEMS.map((item) => ({
        ...item,
        label: t(`${item.labelKey}`),
      })),
    [t]
  );

  const toggleLabel = unit === "km" ? t("toggle_miles") : t("toggle_kilometers");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UISidebar collapsible="icon">
          <SidebarHeader className="border-b px-4 py-6">
            <Link href="/" className="text-xl font-semibold">
              Go Run
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {navigationItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === href}
                    className="font-medium"
                  >
                    <Link href={href}>
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter className="gap-3 px-4 pb-6">
            <Button variant="secondary" onClick={toggleUnit} className="w-full">
              {toggleLabel}
            </Button>
            <LocaleSwitcher />
          </SidebarFooter>
          <SidebarRail />
        </UISidebar>
        <SidebarInset>
          <div className="flex min-h-screen flex-1 flex-col">
            <header className="flex h-16 items-center gap-2 border-b px-4 md:hidden">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold md:hidden">Go Run</h1>
              <div className="ml-auto flex items-center gap-2 md:hidden">
                <Button variant="secondary" size={"sm"} onClick={toggleUnit}>
                  {toggleLabel}
                </Button>
                <LocaleSwitcher />
              </div>
            </header>
            <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

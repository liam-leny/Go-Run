"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { getActivitySchema, ActivityFormValues } from "@/lib/activity.schema";
import { useUnit } from "@/app/[locale]/contexts/UnitContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { fr, enGB } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ActivitiesTable } from "./ActivitiesTable/data-table";
import { useColumns } from "./ActivitiesTable/columns";
import { useEffect, useState } from "react";
import StatsChart from "./StatsChart";
import { convertToKilometers } from "@/lib/distance";

const locales = { fr: fr, en: enGB };

export default function ActivityForm() {
  const t = useTranslations("ActivityForm");
  const tZod = useTranslations("zod");
  const currentLocale = useLocale();
  const locale = locales[currentLocale as keyof typeof locales] || enGB;
  const dateFormat = currentLocale === "fr" ? "PPPP" : "PPP";

  // Stores distances in kilometric units only
  const [data, setData] = useState<ActivityFormValues[]>([]);

  const { unit } = useUnit();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(getActivitySchema(tZod)),
  });

  useEffect(() => {
    const storedData = localStorage.getItem("runningData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  function onSubmit(values: ActivityFormValues) {
    const normalizedValues = {
      ...values,
      distance: convertToKilometers(values.distance, unit),
    };

    const updatedData = [...data, normalizedValues];

    setData(updatedData);
    localStorage.setItem("runningData", JSON.stringify(updatedData));
    form.reset();
  }

  function handleDelete(activityId: string) {
    const updatedData = data.filter(
      (_, index) => index.toString() !== activityId
    );
    setData(updatedData);
    localStorage.setItem("runningData", JSON.stringify(updatedData));
  }

  return (
    <>
      <div className="m-6 gap-12 flex flex-wrap lg:flex-nowrap">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="lg:basis-1/3 grid grid-rows-3 grid-cols-3 justify-items-center justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="col-span-2 grid gap-2 w-full">
                  <FormLabel className="justify-center">{t("date")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, dateFormat, { locale })
                          ) : (
                            <span>{t("pick_a_date")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1990-01-01")
                        }
                        autoFocus
                        locale={locale}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-self-center">
                    {t("distance")} ({unit})
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder={unit === "km" ? "10" : t("miles_placeholder")}
                      min={0}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-self-center">
                    {t("hours")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min={0}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-self-center">
                    {t("minutes")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min={0}
                      max={59}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-self-center">
                    {t("seconds")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      min={0}
                      max={59}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-3 self-center">
              <Button type="submit">{t("save")}</Button>
            </div>
          </form>
        </Form>
        <ActivitiesTable columns={useColumns(handleDelete)} data={data} />
      </div>
      <StatsChart data={data} />
    </>
  );
}

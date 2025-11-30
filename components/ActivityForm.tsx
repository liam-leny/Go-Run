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
import { useActivitiesData } from "@/hooks/use-activities-data";

const locales = { fr: fr, en: enGB };

export default function ActivityForm() {
  const t = useTranslations("ActivityForm");
  const tZod = useTranslations("zod");
  const currentLocale = useLocale();
  const locale = locales[currentLocale as keyof typeof locales] || enGB;
  const dateFormat = currentLocale === "fr" ? "PPPP" : "PPP";

  const { unit } = useUnit();
  const { addActivity } = useActivitiesData();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(getActivitySchema(tZod)),
  });

  function onSubmit(values: ActivityFormValues) {
    addActivity(values);
    form.reset();
  }

  return (
    <div className="flex justify-center md:min-h-[70vh] md:items-center">
      <div className="mt-12 md:mt-0 w-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
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
              <div className="grid gap-4 md:grid-cols-3 md:col-span-2 mt-2 md:mt-4">
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
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                {t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

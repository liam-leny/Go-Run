import { z } from "zod";
import { getPaceCalculatorSchema } from "./pace-calculator.schema";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export function getRunActivitiesSchema(t: (key: string) => string) {
  return getPaceCalculatorSchema(t).extend({
    date: z.coerce
      .date({
        errorMap: (issue, { defaultError }) => ({
          message: issue.code === "invalid_date" ? t("date") : defaultError,
        }),
      })
      .min(new Date("1990-01-01"), { message: t("date_too_old") })
      .max(tomorrow, { message: t("date_too_young") }),
  });
}

export type ActivitiesFormValues = z.infer<
  Awaited<ReturnType<typeof getRunActivitiesSchema>>
>;

import { z } from "zod";

export function getPaceCalculatorSchema(t: (key: string) => string) {
  return z.object({
    distance: z.coerce
      .number({ message: t("number") })
      .positive({ message: t("positive") }),
    hours: z.coerce
      .number({ message: t("number") })
      .int({ message: t("integer") })
      .nonnegative({ message: t("nonnegative") }),
    minutes: z.coerce
      .number({ message: t("number") })
      .int({ message: t("integer") })
      .nonnegative({ message: t("nonnegative") })
      .max(59, { message: t("max_59") }),
    seconds: z.coerce
      .number({ message: t("number") })
      .int({ message: t("integer") })
      .nonnegative({ message: t("nonnegative") })
      .max(59, { message: t("max_59") }),
  });
}

export type PaceCalculatorFormValues = z.infer<
  Awaited<ReturnType<typeof getPaceCalculatorSchema>>
>;

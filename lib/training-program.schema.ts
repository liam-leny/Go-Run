import { z } from "zod";

import {
  MAX_SESSIONS_PER_WEEK,
  MIN_SESSIONS_PER_WEEK,
  type TrainingGoal,
} from "@/lib/training-plan";
import { getPaceCalculatorSchema } from "@/lib/pace-calculator.schema";

const TRAINING_GOALS_ENUM = z.enum(["5k", "10k", "half", "marathon"] as const);

export type TrainingProgramFormValues = {
  goal: TrainingGoal;
  hours: number;
  minutes: number;
  seconds: number;
  sessionsPerWeek: number;
};

type SchemaTranslations = {
  tZod: (key: string) => string;
};

export function getTrainingProgramSchema({
  tZod,
}: SchemaTranslations) {
  const timeSchema = getPaceCalculatorSchema(tZod).pick({
    hours: true,
    minutes: true,
    seconds: true,
  });

  const schema = z
    .object({
      goal: TRAINING_GOALS_ENUM,
      sessionsPerWeek: z.coerce
        .number({ message: tZod("frequency_range") })
        .int({ message: tZod("frequency_range") })
        .min(MIN_SESSIONS_PER_WEEK, {
          message: tZod("frequency_range"),
        })
        .max(MAX_SESSIONS_PER_WEEK, {
          message: tZod("frequency_range"),
        }),
    })
    .merge(timeSchema);

  return schema as z.ZodType<TrainingProgramFormValues>;
}

export type TrainingProgramSchema = Awaited<
  ReturnType<typeof getTrainingProgramSchema>
>;

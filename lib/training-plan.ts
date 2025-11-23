import type { Unit } from "@/app/[locale]/contexts/UnitContext";
import { KM_IN_MILE } from "@/lib/distance";

export type TrainingGoal = "5k" | "10k" | "half" | "marathon";
export type TrainingStage = "base" | "build" | "peak" | "taper";
export type QualityPlacement = "easy" | "steady" | "long";

type GoalConfig = {
  weeks: number;
  raceDistanceKm: number;
  longRun: { start: number; peak: number };
  easyRun: { start: number; peak: number };
  steadyRun?: { start: number; peak: number };
  easyRunsPerWeek: number;
  taperWeeks: number;
  qualityPlacement: Record<TrainingStage, QualityPlacement>;
  taperFactors: {
    long: number[];
    easy: number[];
    steady?: number[];
  };
  stages: {
    base: number;
    build: number;
    peak: number;
  };
  paceMultipliers: {
    easy: number;
    long: number;
    steady?: number;
  };
};

export type PlanRunBlock = {
  distanceKm: number;
  pacePerKm: number;
};

export type PlanWeek = {
  week: number;
  stage: TrainingStage;
  easyRuns: PlanRunBlock & { count: number };
  steadyRun?: PlanRunBlock;
  longRun: PlanRunBlock;
  qualityKey: TrainingStage;
  qualityPlacement: QualityPlacement;
};

export type TrainingPlan = {
  goal: TrainingGoal;
  pacePerKm: number;
  raceDistanceKm: number;
  sessionsPerWeek: number;
  weeks: PlanWeek[];
};

export const TRAINING_GOALS: TrainingGoal[] = ["5k", "10k", "half", "marathon"];

export const MIN_SESSIONS_PER_WEEK = 4;
export const MAX_SESSIONS_PER_WEEK = 6;

const GOAL_CONFIG: Record<TrainingGoal, GoalConfig> = {
  "5k": {
    weeks: 8,
    raceDistanceKm: 5,
    longRun: { start: 6, peak: 12 },
    easyRun: { start: 4, peak: 7 },
    easyRunsPerWeek: 3,
    taperWeeks: 2,
    qualityPlacement: {
      base: "easy",
      build: "easy",
      peak: "easy",
      taper: "easy",
    },
    taperFactors: {
      long: [0.75, 0.55],
      easy: [0.85, 0.65],
    },
    stages: {
      base: 3,
      build: 2,
      peak: 1,
    },
    paceMultipliers: {
      easy: 1.16,
      long: 1.1,
      steady: 1.05,
    },
  },
  "10k": {
    weeks: 10,
    raceDistanceKm: 10,
    longRun: { start: 9, peak: 18 },
    easyRun: { start: 5.5, peak: 8 },
    steadyRun: { start: 7, peak: 12 },
    easyRunsPerWeek: 3,
    taperWeeks: 2,
    qualityPlacement: {
      base: "steady",
      build: "steady",
      peak: "steady",
      taper: "steady",
    },
    taperFactors: {
      long: [0.75, 0.55],
      easy: [0.85, 0.65],
      steady: [0.75, 0.55],
    },
    stages: {
      base: 3,
      build: 3,
      peak: 2,
    },
    paceMultipliers: {
      easy: 1.18,
      long: 1.12,
      steady: 1.05,
    },
  },
  half: {
    weeks: 12,
    raceDistanceKm: 21.1,
    longRun: { start: 14, peak: 26 },
    easyRun: { start: 6.5, peak: 8.5 },
    steadyRun: { start: 9, peak: 14 },
    easyRunsPerWeek: 3,
    taperWeeks: 2,
    qualityPlacement: {
      base: "easy",
      build: "easy",
      peak: "steady",
      taper: "easy",
    },
    taperFactors: {
      long: [0.75, 0.55],
      easy: [0.85, 0.65],
      steady: [0.8, 0.6],
    },
    stages: {
      base: 4,
      build: 3,
      peak: 3,
    },
    paceMultipliers: {
      easy: 1.2,
      long: 1.15,
      steady: 1.08,
    },
  },
  marathon: {
    weeks: 16,
    raceDistanceKm: 42.2,
    longRun: { start: 20, peak: 35 },
    easyRun: { start: 7, peak: 8.5 },
    steadyRun: { start: 12, peak: 20 },
    easyRunsPerWeek: 4,
    taperWeeks: 3,
    qualityPlacement: {
      base: "steady",
      build: "steady",
      peak: "long",
      taper: "steady",
    },
    taperFactors: {
      long: [0.8, 0.6, 0.4],
      easy: [0.85, 0.7, 0.55],
      steady: [0.8, 0.6, 0.45],
    },
    stages: {
      base: 5,
      build: 4,
      peak: 4,
    },
    paceMultipliers: {
      easy: 1.18,
      long: 1.14,
      steady: 1.07,
    },
  },
};

const MIN_DISTANCE_KM = 2;

const mix = (start: number, peak: number, ratio: number) => {
  if (Number.isNaN(ratio)) return start;
  return start + (peak - start) * Math.min(Math.max(ratio, 0), 1);
};

const clampDistance = (distance: number) =>
  Math.max(MIN_DISTANCE_KM, Math.round(distance * 10) / 10);

export const convertPacePerKmToUnit = (pacePerKm: number, unit: Unit) =>
  unit === "mi" ? pacePerKm * KM_IN_MILE : pacePerKm;

export const getRaceDistanceKm = (goal: TrainingGoal) =>
  GOAL_CONFIG[goal].raceDistanceKm;

const computeStage = (weekIndex: number, config: GoalConfig): TrainingStage => {
  const { stages, taperWeeks } = config;
  const baseBoundary = stages.base;
  const buildBoundary = stages.base + stages.build;
  const peakBoundary = buildBoundary + stages.peak;
  const taperStart = config.weeks - taperWeeks;

  if (weekIndex < baseBoundary) return "base";
  if (weekIndex < buildBoundary) return "build";
  if (weekIndex < peakBoundary && weekIndex < taperStart) return "peak";
  return "taper";
};

export const generateTrainingPlan = (
  goal: TrainingGoal,
  pacePerKm: number,
  options?: { sessionsPerWeek?: number }
): TrainingPlan => {
  const config = GOAL_CONFIG[goal];
  const rampWeeks = config.weeks - config.taperWeeks;
  const qualitySessions = 1 + (config.steadyRun ? 1 : 0);
  const defaultSessions = config.easyRunsPerWeek + qualitySessions;
  const requestedSessions = options?.sessionsPerWeek ?? defaultSessions;
  const clampedSessions = Math.max(
    MIN_SESSIONS_PER_WEEK,
    Math.min(MAX_SESSIONS_PER_WEEK, requestedSessions)
  );
  const easyRunsCount = Math.max(1, clampedSessions - qualitySessions);

  const weeks: PlanWeek[] = Array.from({ length: config.weeks }, (_, index) => {
    const stage = computeStage(index, config);
    const rampIndex = Math.min(index, Math.max(rampWeeks - 1, 0));
    const progress = rampWeeks <= 1 ? 1 : rampIndex / (rampWeeks - 1);

    let easyDistanceKm = mix(
      config.easyRun.start,
      config.easyRun.peak,
      progress
    );
    let longDistanceKm = mix(
      config.longRun.start,
      config.longRun.peak,
      progress
    );
    let steadyDistanceKm = config.steadyRun
      ? mix(config.steadyRun.start, config.steadyRun.peak, progress)
      : undefined;

    if (stage === "taper") {
      const taperIndex = index - rampWeeks;
      const { taperFactors } = config;

      const longFactor =
        taperFactors.long[taperIndex] ?? taperFactors.long.at(-1) ?? 0.6;
      longDistanceKm = config.longRun.peak * longFactor;

      const easyFactor =
        taperFactors.easy[taperIndex] ?? taperFactors.easy.at(-1) ?? 0.7;
      easyDistanceKm = config.easyRun.peak * easyFactor;

      if (steadyDistanceKm !== undefined && taperFactors.steady) {
        const steadyFactor =
          taperFactors.steady[taperIndex] ?? taperFactors.steady.at(-1) ?? 0.6;
        steadyDistanceKm = config.steadyRun!.peak * steadyFactor;
      }
    }

    const isDownWeek = stage !== "taper" && (index + 1) % 4 === 0;
    if (isDownWeek) {
      easyDistanceKm *= 0.85;
      longDistanceKm *= 0.85;
      if (steadyDistanceKm !== undefined) {
        steadyDistanceKm *= 0.85;
      }
    }

    easyDistanceKm = clampDistance(easyDistanceKm);
    longDistanceKm = clampDistance(longDistanceKm);
    if (steadyDistanceKm !== undefined) {
      steadyDistanceKm = clampDistance(steadyDistanceKm);
    }

    const { paceMultipliers } = config;
    const easyPace = pacePerKm * paceMultipliers.easy;
    const longPace = pacePerKm * paceMultipliers.long;
    const steadyMultiplier = paceMultipliers.steady ?? paceMultipliers.long;

    const easyRuns: PlanWeek["easyRuns"] = {
      count: easyRunsCount,
      distanceKm: easyDistanceKm,
      pacePerKm: easyPace,
    };

    const steadyRun =
      config.steadyRun && steadyDistanceKm !== undefined
        ? {
            distanceKm: steadyDistanceKm!,
            pacePerKm: pacePerKm * steadyMultiplier,
          }
        : undefined;

    const longRun: PlanRunBlock = {
      distanceKm: longDistanceKm,
      pacePerKm: longPace,
    };

    const qualityPlacement =
      config.qualityPlacement[stage] ?? (config.steadyRun ? "steady" : "easy");

    return {
      week: index + 1,
      stage,
      easyRuns,
      steadyRun,
      longRun,
      qualityKey: stage,
      qualityPlacement,
    };
  });

  return {
    goal,
    pacePerKm,
    raceDistanceKm: config.raceDistanceKm,
    sessionsPerWeek: clampedSessions,
    weeks,
  };
};

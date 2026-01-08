import { Unit } from "@/app/[locale]/contexts/UnitContext";
import { convertDistance } from "@/lib/distance";
import { convertPacePerKmToUnit } from "@/lib/training-plan";

const formatDistanceValue = (distance: number, locale: string) => {
  const rounded = Math.round(distance * 10) / 10;
  const isInteger = Math.abs(rounded - Math.round(rounded)) < Number.EPSILON;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: isInteger ? 0 : 1,
    maximumFractionDigits: isInteger ? 0 : 1,
  }).format(rounded);
};

export const formatDistance = (
  distance: number,
  unit: Unit,
  locale: string
) => `${formatDistanceValue(distance, locale)} ${unit}`;

export const formatDistanceFromKm = (
  distanceKm: number,
  unit: Unit,
  locale: string
) => formatDistance(convertDistance(distanceKm, unit), unit, locale);

export const formatDistanceValueFromKm = (
  distanceKm: number,
  unit: Unit,
  locale: string
) => formatDistanceValue(convertDistance(distanceKm, unit), locale);

export const formatDuration = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatPaceFromSecondsAndDistance = (
  totalSeconds: number,
  distance: number
) => {
  const secondsPerUnit = totalSeconds / Math.max(distance, 0.0001);
  const paceMinutes = Math.floor(secondsPerUnit / 60);
  const paceSeconds = Math.round(secondsPerUnit % 60);
  const normalizedSeconds = paceSeconds === 60 ? 0 : paceSeconds;
  const normalizedMinutes =
    paceSeconds === 60 ? paceMinutes + 1 : paceMinutes;

  return `${normalizedMinutes}:${normalizedSeconds.toString().padStart(2, "0")}`;
};

export const formatPaceFromPerKm = (pacePerKm: number, unit: Unit) => {
  const pace = convertPacePerKmToUnit(pacePerKm, unit);
  const totalSeconds = Math.max(0, Math.round(pace * 60));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

import type { Unit } from "@/app/[locale]/contexts/UnitContext";

export const KM_IN_MILE = 1.609344;

export const convertDistance = (distanceInKm: number, unit: Unit) => {
  return unit === "miles" ? distanceInKm / KM_IN_MILE : distanceInKm;
};

export const convertToKilometers = (distance: number, unit: Unit) => {
  return unit === "miles" ? distance * KM_IN_MILE : distance;
};

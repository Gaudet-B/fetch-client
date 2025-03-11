"use server";

import { GeoBox } from "~/types/api";

export async function getGeoBoundingBox(
  centerLat: number,
  centerLon: number,
  distance: number,
) {
  const miles = distance || 1;
  const milesPerLatDegree = 69; // approx conversion for latitude.
  const deltaLat = miles / milesPerLatDegree;

  // Calculate miles per degree for longitude, which varies with latitude.
  const radians = centerLat * (Math.PI / 180);
  const milesPerLonDegree = 69 * Math.cos(radians);
  const deltaLon = miles / milesPerLonDegree;

  return {
    bottom_left: {
      lat: centerLat - deltaLat,
      lon: centerLon - deltaLon,
    },
    top_right: {
      lat: centerLat + deltaLat,
      lon: centerLon + deltaLon,
    },
  } as GeoBox;
}

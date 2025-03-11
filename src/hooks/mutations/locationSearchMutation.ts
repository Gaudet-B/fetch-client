import { useMutation } from "@tanstack/react-query";
import { Location, LocationSearchType } from "~/types/api";
import { postOptions } from "~/server/requestOptions";
import { getGeoBoundingBox } from "~/server/locationUtil";

type LocationMutationInput = {
  zipCode: string;
  distance: number;
};

async function getLocations(input: LocationMutationInput) {
  const { zipCode, distance } = input;

  const options = await postOptions();

  const locationResponse = await fetch("/api/locations", {
    ...options,
    body: JSON.stringify([zipCode]),
  });

  if (!locationResponse.ok) {
    throw new Error(
      `Failed to fetch locations for ${zipCode}. Error: ${locationResponse.statusText}. Error Code: ${locationResponse.status}`,
    );
  }

  const l = (await locationResponse.json()) as readonly [Location];
  const location = l[0];
  const geoBoundingBox = await getGeoBoundingBox(
    location.latitude,
    location.longitude,
    distance,
  );

  const searchOptions: LocationSearchType = {
    geoBoundingBox,
  };
  const response = await fetch("/api/locations/search", {
    ...options,
    body: JSON.stringify(searchOptions),
  });

  const locations = (await response.json()) as Array<Location>;
  return locations;
}

export default function useLocationSearchMutation() {
  return useMutation({ mutationFn: getLocations });
}

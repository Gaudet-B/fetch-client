"use server";

import { Dog, Location } from "../types/api";
import { DogRow } from "../app/search/columns";

export async function addLocationsToDogs(
  dogs: Array<Dog>,
  locations: Array<Location | null>,
) {
  const updatedDogs: Array<DogRow> = [];
  dogs.forEach((dog) => {
    const locationMatch = locations.find(
      (location) => location?.zip_code === dog.zip_code,
    ) as Location | undefined;
    const location = locationMatch ?? {
      zip_code: dog.zip_code,
      latitude: 0,
      longitude: 0,
      city: "",
      state: "",
      county: "",
    };
    updatedDogs.push({ ...dog, location });
  });
  return updatedDogs;
}

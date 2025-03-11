import { useQuery } from "@tanstack/react-query";
import { getOptions } from "~/server/requestOptions";
import { SearchResultsType } from "~/types/api";

async function getAllDogs() {
  const options = await getOptions();
  const response = await fetch("/api/dogs/init", {
    ...options,
  });
  return (await response.json()) as SearchResultsType;
}

export default function useInitQuery() {
  return useQuery({ queryKey: ["initDogs"], queryFn: getAllDogs });
}

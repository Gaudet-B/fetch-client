import { useCallback, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getOptions } from "~/server/requestOptions";
import {
  SearchErrorType,
  SearchOptionsType,
  SearchResultsType,
} from "~/types/api";

const DEFAULT_SEARCH_OPTIONS = { searchOptions: undefined, url: undefined };
const DEFAULT_SEARCH_URL = "/api/dogs/search?sort=breed:asc&size=25";

type SearchOptions = {
  searchOptions?: SearchOptionsType;
  url?: string;
};

async function getSearchResults(opts: SearchOptions) {
  const { searchOptions, url } = opts;
  const params = searchOptions ? new URLSearchParams() : undefined;
  if (params && searchOptions) {
    Object.entries(searchOptions).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          params.append(key, String(item));
        });
      } else {
        params.append(key, String(value));
      }
    });
    // add the default sort and size
    if (!params.has("sort")) params.append("sort", "breed:asc");
    if (!params.has("size")) params.append("size", "25");
  }
  let searchUrl = DEFAULT_SEARCH_URL;
  if (params) searchUrl = `/api/dogs/search?${params.toString()}`;
  if (url) searchUrl = `/api/dogs/search?url=${url}`;
  const options = await getOptions();
  const response = await fetch(searchUrl, {
    ...options,
  });
  const results = (await response.json()) as
    | SearchResultsType
    | SearchErrorType;
  return results;
}

export default function useSearchQuery(options?: SearchOptions) {
  const [searchOptions, setSearchOptions] = useState<{
    searchOptions?: SearchOptionsType;
    url?: string;
  }>(options ?? DEFAULT_SEARCH_OPTIONS);

  const queryClient = useQueryClient();

  const getResults = useCallback(async () => {
    const options = { ...searchOptions };
    return getSearchResults(options);
  }, [searchOptions]);

  return {
    searchOptions,
    setSearchOptions,
    invalidate: () =>
      queryClient.invalidateQueries({
        queryKey: ["search", searchOptions],
        type: "all",
      }),
    useQuery: () =>
      useQuery({
        queryKey: ["search", searchOptions],
        queryFn: getResults,
        placeholderData: keepPreviousData,
      }),
  };
}

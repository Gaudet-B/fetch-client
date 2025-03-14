"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import useSearch, { FiltersType } from "~/hooks/useSearch";
import {
  SearchResultsType,
  PaginationType,
  SearchOptionsType,
  SortableFields,
} from "~/types/api";
import { DogRow } from "./columns";

type SearchContextType =
  | {
      allBreeds: Array<string> | undefined;
      dogs: Array<DogRow> | undefined;
      favorites: Array<DogRow> | undefined;
      filters: FiltersType;
      isLoading: boolean | undefined;
      match: DogRow | undefined;
      matchLoading: boolean | undefined;
      pagination: PaginationType | undefined;
      searchData: SearchResultsType | undefined;
      searchOptions: { searchOptions?: SearchOptionsType; url?: string };
      searchText: string | undefined;
      searchTerms: Array<string> | undefined;
      showMatch: boolean;
      handleClearAllFilters: () => void;
      handleClearDogChipsFilter: (dog: DogRow) => void;
      handleClearBreedsFilter: () => void;
      handleCloseModal: () => void;
      handleCloseSearchDropdown: () => void;
      handleFiltersChange: (
        key: keyof FiltersType,
        value: FiltersType[keyof FiltersType],
      ) => void;
      handleMatch: () => void;
      handleSearchTextChange: (value: string | undefined) => void;
      handleSelectSearchTerm: (value: string) => void;
      handleSubmitSearch: (optionsOrUrl: SearchOptionsType | string) => void;
      handleUpdateFavorites: (dogId: DogRow["id"], selected: boolean) => void;
      handleSortChange: (
        field: SortableFields,
        direction: "asc" | "desc",
      ) => void;
    }
  | undefined;

const SearchContext = createContext<SearchContextType>(undefined);

export function SearchProvider({
  searchResults,
  loading,
  children,
}: PropsWithChildren<{
  searchResults?: SearchResultsType;
  loading: boolean;
}>) {
  const results = searchResults ?? ({} as SearchResultsType);
  const { breeds, dogs, next, prev, total } = results;
  const pagination = { next, prev, total };
  const search = useSearch(breeds, dogs, pagination, loading);

  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}

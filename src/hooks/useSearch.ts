import { useEffect, useState } from "react";
import { PaginationType, SearchOptionsType } from "~/types/api";
import { DogRow } from "~/app/search/columns";
import locationSearchMutation from "./mutations/locationSearchMutation";
import useMatchMutation from "./mutations/matchMutation";
import useSearchQuery from "./queries/useSearchQuery";

export type FiltersType = {
  breeds: Array<string>;
  ageMin: number;
  ageMax: number;
  zipCode: string;
  distance: number;
};

const DEFAULT_FILTERS: FiltersType = {
  breeds: [],
  ageMin: 0,
  ageMax: 99,
  zipCode: "",
  distance: 0,
};

export default function useSearch(
  initialBreeds?: Array<string>,
  initialDogs?: Array<DogRow>,
  initialPagination?: PaginationType,
  loading?: boolean,
) {
  const [allBreeds, setAllBreeds] = useState<Array<string> | undefined>();
  const [dogs, setDogs] = useState<Array<DogRow> | undefined>();
  const [favorites, setFavorites] = useState<Array<DogRow> | undefined>();
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(true);
  const [match, setMatch] = useState<DogRow | undefined>();
  const [matchLoading, setMatchLoading] = useState<boolean | undefined>();
  const [pagination, setPagination] = useState<PaginationType | undefined>();
  const [searchText, setSearchText] = useState<string | undefined>("");
  const [searchTerms, setSearchTerms] = useState<Array<string> | undefined>();
  const [showMatch, setShowMatch] = useState<boolean>(false);

  const [allSearchTerms, setAllSearchTerms] = useState<
    Array<string> | undefined
  >();

  const { searchOptions, setSearchOptions, invalidate, useQuery } =
    useSearchQuery();

  const handleUpdateFavorites = (dogId: DogRow["id"], selected: boolean) => {
    const dog = dogs?.find((dog) => dog.id === dogId);
    const updatedFavorites = [...(favorites ?? [])];
    if (selected) {
      dog && updatedFavorites.push(dog);
    } else {
      dog && updatedFavorites.splice(updatedFavorites.indexOf(dog), 1);
    }
    setFavorites(Array.from(new Set(updatedFavorites)));
  };

  const handleSearchTextChange = (value: string | undefined) => {
    if (value?.length && value.length > 0 && value !== " ") {
      const terms = new Set(
        allSearchTerms?.filter((term) =>
          term.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setSearchTerms(Array.from(terms));
      setSearchText(value);
    } else {
      setSearchText(value);
      setSearchTerms(undefined);
    }
  };

  const handleCloseSearchDropdown = () => setSearchTerms(undefined);

  const handleSearchOptionsChange = (options: typeof searchOptions) => {
    setIsLoading(true);
    setSearchOptions(options);
    invalidate();
  };

  const locationMutation = locationSearchMutation();

  const handleLocationSearch = (options: {
    zipCode?: string;
    distance?: number;
  }) => {
    const locationOptions = { ...options };
    const { zipCode, distance } = locationOptions;

    // handle edge cases
    if (!zipCode) return;
    if (zipCode && zipCode.length !== 5) return;

    if (!distance && distance !== 0) return; // zero is flasy, but is a valid input
    if (distance && (distance < 0 || distance > 100)) return;

    // after checking for edge cases, set loading to true
    setIsLoading(true);

    locationMutation.mutate(
      { zipCode, distance },
      {
        onSuccess: (data) => {
          handleSearchOptionsChange({
            searchOptions: {
              ...searchOptions.searchOptions,
              zipCodes: data.map((location) => location.zip_code),
            },
            url: undefined,
          });
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  const handleFiltersChange = (
    key: keyof FiltersType,
    value: FiltersType[keyof FiltersType],
  ) => {
    const originalFilters = { ...filters };
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    if (key === "zipCode" || key === "distance") {
      const { zipCode, distance } = updatedFilters;
      // if neither the zipCode nor distance have changed, don't make unnecessary api call
      if (
        zipCode !== originalFilters.zipCode ||
        distance !== originalFilters.distance
      ) {
        handleLocationSearch({ zipCode, distance });
      }
    } else {
      // Set loading state to true for non-location filters
      setIsLoading(true);

      const options = searchOptions.searchOptions ?? {};
      handleSearchOptionsChange({
        searchOptions: {
          ...options,
          [key]: value,
        },
        url: undefined,
      });
    }
  };

  const handleUpdateBreeds = (breeds: Array<string>) => {
    const updatedFilters = { ...filters, breeds: [...breeds] };
    handleFiltersChange("breeds", updatedFilters.breeds);
  };

  const handleClearBreedsFilter = () => handleUpdateBreeds([]);

  const handleClearDogChipsFilter = (dog: DogRow) =>
    setFavorites(favorites?.filter((favorite) => favorite.id !== dog.id));

  const handleClearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    handleSearchOptionsChange({
      searchOptions: undefined,
      url: undefined,
    });
  };

  const {
    data: searchData,
    isLoading: searchLoading,
    isError: searchError,
  } = useQuery();

  useEffect(() => {
    if (searchData) {
      const { dogs, next, prev, total } = searchData;
      setDogs(dogs);
      setPagination({ next, prev, total });
    }
    if (searchLoading !== isLoading) setIsLoading(searchLoading);
  }, [searchData]);

  const handleSubmitSearch = (optionsOrUrl: SearchOptionsType | string) => {
    if (typeof optionsOrUrl === "string") {
      handleSearchOptionsChange({
        url: optionsOrUrl,
        searchOptions: undefined,
      });
    } else {
      handleSearchOptionsChange({
        searchOptions: optionsOrUrl,
        url: undefined,
      });
    }
  };

  const handleSelectSearchTerm = (value: string) => {
    handleUpdateBreeds([...filters.breeds, value]);
    setSearchText(value);
    setSearchTerms(undefined);
  };

  const matchMutation = useMatchMutation();

  const handleMatch = () => {
    setMatchLoading(true);
    const favoriteIds = favorites?.map((favorite) => favorite.id) ?? [];

    matchMutation.mutate(favoriteIds, {
      onSuccess: (data) => {
        setMatch(favorites?.find((favorite) => favorite.id === data));
      },
      onError: (error) => {
        console.error(error);
      },
      onSettled: () => {
        setMatchLoading(false);
        setShowMatch(true);
      },
    });
  };

  const handleCloseModal = () => {
    setMatchLoading(false);
    setShowMatch(false);
    setMatch(undefined);
  };

  useEffect(() => {
    if (initialDogs && !dogs) setDogs(initialDogs);
    if (initialBreeds && !allBreeds) setAllBreeds(initialBreeds);
    if (initialBreeds && !allSearchTerms) setAllSearchTerms(initialBreeds);
    if (initialPagination && !pagination?.total)
      setPagination(initialPagination);

    if (loading !== isLoading) setIsLoading(loading);
  }, [initialDogs]);

  return {
    allBreeds,
    dogs,
    favorites,
    filters,
    isLoading,
    match,
    matchLoading,
    pagination,
    searchData,
    searchError,
    searchText,
    searchTerms,
    showMatch,
    handleClearAllFilters,
    handleClearBreedsFilter,
    handleClearDogChipsFilter,
    handleCloseModal,
    handleCloseSearchDropdown,
    handleFiltersChange,
    handleMatch,
    handleSearchTextChange,
    handleSelectSearchTerm,
    handleSubmitSearch,
    handleUpdateFavorites,
  };
}

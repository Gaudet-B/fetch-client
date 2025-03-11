"use client";

import {
  PropsWithChildren,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Field, Label, Button as HeadlessButton } from "@headlessui/react";
import { Scrollable } from "@designsystem/container";
import { H2 } from "@designsystem/text/heading";
import Slider from "@designsystem/slider";
import Button, { PaginationButton } from "@designsystem/button";
import {
  NumberInput,
  SearchInput,
  Select,
  TextInput,
} from "@designsystem/form/input";
import Modal from "@designsystem/modal";
import Table from "@components/table";
import useInitDogs from "~/hooks/queries/useInitQuery";
import { PaginationType } from "~/types/api";
import { SearchProvider, useSearchContext } from "./context";
import { DogRow, getColumns } from "./columns";
import debounce from "lodash.debounce";

const PLACEHOLDER_ROWS = Array.from(
  { length: 10 },
  (_) => ({}), // eslint-disable-line @typescript-eslint/no-unused-vars
) as Array<DogRow>;

function MatchContent({ match }: { match?: DogRow }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div
        className="h-52 w-52 rounded-2xl"
        style={{
          backgroundImage: `url(${match?.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="flex flex-col items-center justify-center gap-1 font-semibold text-blue-900">
        <h1 className="text-3xl">{match?.name}!</h1>
        <span className="text-sm opacity-80">{match?.breed}</span>
        <span className="text-sm opacity-80">{match?.age} years old</span>
        <span className="text-sm opacity-80">
          {match?.location?.city}, {match?.location?.state}
        </span>
      </div>
    </div>
  );
}

export function MatchModal() {
  const { match, showMatch, handleCloseModal } = useSearchContext();
  return (
    <Modal
      show={showMatch}
      handleClose={handleCloseModal}
      title={"you've been matched with"}
      withConfetti
    >
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <MatchContent match={match} />
        <div className="w-52">
          <Button onClick={handleCloseModal}>continue browsing</Button>
        </div>
      </div>
    </Modal>
  );
}

export function MatchButton() {
  const { handleMatch } = useSearchContext();

  return <Button onClick={handleMatch}>find a match!</Button>;
}

export function SearchBar() {
  const {
    searchTerms,
    searchText,
    handleCloseSearchDropdown,
    handleSearchTextChange,
    handleSelectSearchTerm,
  } = useSearchContext();

  return (
    <SearchInput
      name="search"
      label="search for a breed"
      onBlur={handleCloseSearchDropdown}
      onChange={handleSearchTextChange}
      onSelect={handleSelectSearchTerm}
      items={searchTerms}
      value={searchText}
    />
  );
}

function FilterContainer({ children }: PropsWithChildren) {
  return <div className="font-roboto flex flex-col gap-4">{children}</div>;
}

function FilterField({ children }: PropsWithChildren) {
  return <Field className="flex flex-col gap-2">{children}</Field>;
}

function DistanceSlider({
  onChange,
  disabled,
}: {
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative h-12 w-72 pt-2">
      <Slider onChange={onChange} disabled={disabled} />
    </div>
  );
}

function ClearFilterButton({
  onClick,
  hover = "hover:text-blue-900",
}: {
  onClick: () => void;
  hover?: string;
}) {
  return (
    <HeadlessButton
      onClick={onClick}
      className={`transition-color h-full w-4 text-xs font-semibold text-gray-400 duration-500 ease-out ${hover}`}
    >
      x
    </HeadlessButton>
  );
}

function DogChip({
  children,
  onClose,
}: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-blue-900 px-1 py-2 text-center text-white">
      <span className="w-[9ch] overflow-hidden text-ellipsis">{children}</span>
      <div className="relative h-0 -translate-y-10 translate-x-9">
        <ClearFilterButton onClick={onClose} hover="hover:text-green-400" />
      </div>
    </div>
  );
}

export function SearchFilters() {
  const {
    allBreeds,
    favorites,
    filters,
    handleClearAllFilters,
    handleClearDogChipsFilter,
    handleClearBreedsFilter,
    handleFiltersChange,
  } = useSearchContext();

  return (
    <div className="flex max-w-[300px] flex-col gap-4">
      <div className="flex h-min flex-col gap-6 rounded-2xl bg-slate-300 p-3 text-blue-900 shadow-md">
        <div className="flex items-center justify-between">
          <H2 className="font-semibold">filter results</H2>
          <div className="w-20">
            <Button theme="secondary" onClick={handleClearAllFilters}>
              clear all
            </Button>
          </div>
        </div>
        <FilterContainer>
          {/* breed */}
          <FilterField>
            <Label className="text-lg">breeds</Label>
            <Select
              name="breed"
              label="breed"
              items={allBreeds ?? []}
              placeholder="none selected"
              selected={filters.breeds}
              onChange={(value) =>
                handleFiltersChange("breeds", value as string[])
              }
              multiple
            />
            <div className="absolute translate-x-[198px] translate-y-7">
              {filters.breeds && filters.breeds.length > 0 && (
                <ClearFilterButton onClick={handleClearBreedsFilter} />
              )}
            </div>
          </FilterField>

          {/* age */}
          <FilterField>
            <Label className="text-lg">age</Label>
            <div className="flex items-center gap-1">
              <Label className="flex h-6 w-9 items-center justify-center rounded-md bg-white text-xs font-semibold">
                MIN
              </Label>
              <NumberInput
                name="ageMin"
                onChange={(value) => handleFiltersChange("ageMin", value)}
                min={0}
                max={filters.ageMax}
                value={filters.ageMin}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label className="flex h-6 w-9 items-center justify-center rounded-md bg-white text-xs font-semibold">
                MAX
              </Label>
              <NumberInput
                name="ageMax"
                onChange={(value) => handleFiltersChange("ageMax", value)}
                min={filters.ageMin}
                max={99}
                value={filters.ageMax}
              />
            </div>
          </FilterField>

          {/* distance */}
          <FilterField>
            <Label className="text-lg">distance</Label>
            <div className="h-8 w-24">
              <TextInput
                name="zipCode"
                label="zip code"
                onChange={debounce(
                  (value) => handleFiltersChange("zipCode", value),
                  500,
                )}
              />
            </div>
            <DistanceSlider
              onChange={debounce(
                (value) => handleFiltersChange("distance", value),
                500,
              )}
              disabled={!filters.zipCode}
            />
          </FilterField>
        </FilterContainer>
      </div>

      {favorites && favorites.length > 0 && (
        <div className="flex max-h-[100px] w-full flex-wrap justify-center gap-2 overflow-y-auto">
          {favorites.map((dog) => (
            <div key={`dog-chip-${dog.id}`} className="flex items-center">
              <DogChip onClose={() => handleClearDogChipsFilter(dog)}>
                {dog.name}
              </DogChip>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaginationControls() {
  const { pagination, handleSubmitSearch } = useSearchContext();

  const handlePrev = () => handleSubmitSearch(pagination?.prev ?? "");

  const handleNext = () => handleSubmitSearch(pagination?.next ?? "");

  return (
    <div className="flex h-9 w-full items-center justify-between border-t-2 border-blue-900 bg-slate-50 px-4 py-2 align-baseline font-semibold text-blue-900 transition-colors">
      <PaginationButton
        onClick={handlePrev}
        direction="prev"
        disabled={!pagination?.prev}
      />
      <PaginationButton
        onClick={handleNext}
        direction="next"
        disabled={!pagination?.next}
      />
    </div>
  );
}

function DogTable({
  containerWidth,
  pagination,
  resultsRef,
  setContainerWidth,
}: {
  containerWidth: number | undefined;
  pagination?: PaginationType;
  resultsRef: RefObject<HTMLDivElement | null>;
  setContainerWidth: (width: number) => void;
}) {
  const { dogs, isLoading } = useSearchContext();

  const data = useMemo(() => {
    if (isLoading || !dogs) return PLACEHOLDER_ROWS;
    return dogs;
  }, [dogs, isLoading]);

  const columns = useMemo(() => getColumns(), []);

  return (
    <>
      <Table<DogRow>
        columns={columns}
        data={data}
        loading={isLoading}
        pagination={pagination}
        width={containerWidth}
        setContainerWidth={setContainerWidth}
        widthRef={resultsRef}
      />
      <PaginationControls />
    </>
  );
}

export function SearchResultsList({
  containerRef,
  pagination,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  pagination?: PaginationType;
}) {
  const [containerHeight, setContainerHeight] = useState<number | undefined>();
  const [containerWidth, setContainerWidth] = useState<number | undefined>();
  const { isLoading } = useSearchContext();

  const resultsRef = useRef<HTMLDivElement>(null);
  const prevLoadingRef = useRef(isLoading);

  // Reset scroll position when loading finishes
  useEffect(() => {
    if (prevLoadingRef.current === true && isLoading === false) {
      const scrollableElement = resultsRef.current?.querySelector(
        "div.overflow-y-auto",
      );
      if (scrollableElement) {
        scrollableElement.scrollTop = 0;
      }
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    setContainerHeight(containerRef?.current?.clientHeight);
    setContainerWidth(resultsRef?.current?.clientWidth);
  }, [containerRef, resultsRef]);

  return (
    <div
      ref={resultsRef}
      className="h-full max-w-[900px] grow overflow-hidden rounded-2xl border border-transparent bg-slate-200"
    >
      <Scrollable height={containerHeight}>
        {containerHeight && (
          <DogTable
            key={`table-${isLoading ? "loading" : "loaded"}-${Date.now()}`}
            containerWidth={containerWidth}
            setContainerWidth={setContainerWidth}
            resultsRef={resultsRef}
            pagination={pagination}
          />
        )}
      </Scrollable>
    </div>
  );
}

export function SearchResults() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pagination } = useSearchContext();

  return (
    <div
      ref={containerRef}
      className="flex w-full grow items-stretch justify-center gap-4"
    >
      <SearchFilters />
      <SearchResultsList containerRef={containerRef} pagination={pagination} />
    </div>
  );
}

export function SearchContent({ children }: PropsWithChildren) {
  return (
    <div className="flex grow">
      <div className="flex h-full w-full flex-col items-center justify-stretch gap-4 px-4 pb-2 pt-4">
        {children}
      </div>
    </div>
  );
}

export function SearchContentContainer({ children }: PropsWithChildren) {
  const { data, isLoading } = useInitDogs();
  return (
    <SearchProvider searchResults={data} loading={isLoading}>
      {children}
    </SearchProvider>
  );
}

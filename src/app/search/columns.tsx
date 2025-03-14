"use client";

import {
  createColumnHelper,
  ColumnDef,
  CellContext,
  HeaderContext,
} from "@tanstack/react-table";
import { useColumnSizingContext } from "@components/table/context";
import { FavoriteButton } from "~/app/_components/design-system/button/button";
import { Location, SortableFields } from "~/types/api";
import { useSearchContext } from "./context";
import { useMemo } from "react";

export type DogRow = {
  id: string;
  img: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  location: Location;
};

function HeaderCell({
  text,
  sortField,
  headerProps,
}: {
  text: string;
  sortField?: SortableFields;
  headerProps?: HeaderContext<DogRow, string>;
}) {
  const isSorted = headerProps?.table
    .getState()
    .sorting.find((col) => col.id === sortField);

  const sortDirection = isSorted?.desc ? "desc" : "asc";

  const { handleSortChange } = useSearchContext();

  const handleClick = !sortField
    ? undefined
    : () => {
        const sortingState = headerProps?.table
          .getState()
          .sorting?.find((col) => col.id === sortField);

        const newDirection = sortingState?.desc ? "asc" : "desc";

        handleSortChange(sortField, newDirection);
      };

  return (
    <div
      className={`flex h-full items-center gap-1 ${sortField ? "cursor-pointer transition-all duration-100 hover:text-green-500" : ""}`}
      onClick={handleClick}
    >
      <span
        className={`scale-95 font-sans text-lg ${sortField ? "hover:scale-100" : ""} ${isSorted ? "scale-100" : ""}`}
      >
        {text}
      </span>
      {isSorted && (
        <span
          className={`text-sm ${sortDirection === "asc" ? "" : "rotate-180"}`}
        >
          ▼
        </span>
      )}
    </div>
  );
}

function ImgCell(props: CellContext<DogRow, string>) {
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.img;
  const img = props.getValue();

  return (
    <div
      className="flex items-center justify-center pl-1"
      style={{ width: `${width}px` }}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-lg border-2 border-gray-600 ${
          img ? "" : "opacity-50"
        }`}
      >
        <div
          role="img"
          aria-label="dog image"
          className="h-full w-full rounded-md"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
}

function NameCell(props: CellContext<DogRow, string>) {
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.name;
  const name = props.getValue();

  return (
    <div
      className="flex w-full -translate-y-4 items-center justify-start pl-4 text-lg font-semibold"
      style={{ width: `${width}px` }}
    >
      {name}
    </div>
  );
}

function AgeCell(props: CellContext<DogRow, number>) {
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.age;
  const age = props.getValue();

  const getAgeText = (age: number) => {
    if (age === undefined) return "";
    switch (age) {
      case 0:
        return "less than a year old";
      case 1:
        return "1 year old";
      default:
        return `${age} years old`;
    }
  };

  return (
    <div
      className="flex w-full -translate-x-16 translate-y-3 items-center justify-start text-nowrap px-2 text-sm font-semibold text-gray-800"
      style={{ width: `${width}px` }}
    >
      {getAgeText(age)}
    </div>
  );
}

function LocationCell(props: CellContext<DogRow, Location>) {
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.location;
  const location = props.getValue() as Location | undefined;

  return (
    <div
      className="flex w-full items-center justify-start pl-3 font-sans"
      style={{ width: `${width}px` }}
    >
      {!location ? "" : null}
      {location?.city === "" ? "UNKNOWN" : null}
      {location?.city && location?.state
        ? `${location.city}, ${location.state}`
        : null}
    </div>
  );
}

function BreedCell(props: CellContext<DogRow, string>) {
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.breed;
  return (
    <div
      className="flex w-full items-center justify-start pl-3 font-sans"
      style={{ width: `${width}px` }}
    >
      {props.getValue()}
    </div>
  );
}

function ActionsHeader() {
  return (
    <div className="flex h-10 -translate-x-2 items-center justify-center rounded-lg border border-green-400 bg-white p-1 text-center font-sans text-xs font-semibold text-green-500">
      <span> + add to favorites</span>
    </div>
  );
}

function ActionsCell(props: CellContext<DogRow, string>) {
  const dogId = props.row.original.id;
  const { columnSizing } = useColumnSizingContext();
  const width = columnSizing.actions;
  const { favorites, handleUpdateFavorites } = useSearchContext();

  const dogIds = useMemo(
    () => favorites?.map((favorite) => favorite.id),
    [favorites],
  );

  const handleClick = () => {
    handleUpdateFavorites(dogId, !dogIds?.includes(dogId));
  };

  return (
    <div
      className={`flex h-full items-center justify-center ${
        !dogId ? "opacity-50" : ""
      }`}
      style={{ width: `${width}px` }}
    >
      <FavoriteButton
        selected={!!dogIds?.includes(dogId)}
        onClick={handleClick}
        disabled={!dogId}
      />
    </div>
  );
}

export function getColumns() {
  const columnHelper = createColumnHelper<DogRow>();
  return [
    columnHelper.accessor("img", {
      id: "img",
      header: "",
      cell: (props) => <ImgCell {...props} />,
      size: 90,
      maxSize: 90,
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: (props) => (
        <HeaderCell headerProps={props} text="age" sortField="age" />
      ),
      cell: (props) => <NameCell {...props} />,
      enableSorting: true,
      size: 70,
      maxSize: 70,
    }),
    columnHelper.accessor("age", {
      id: "age",
      header: "",
      cell: (props) => <AgeCell {...props} />,
      enableSorting: true,
      size: 80,
      maxSize: 80,
    }),
    columnHelper.accessor("breed", {
      id: "breed",
      header: (props) => (
        <HeaderCell headerProps={props} text="breed" sortField="breed" />
      ),
      cell: (props) => <BreedCell {...props} />,
      enableSorting: true,
      size: 100,
    }),
    columnHelper.accessor("location", {
      id: "location",
      header: () => <HeaderCell text="location" />,
      cell: (props) => <LocationCell {...props} />,
      size: 100,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <ActionsHeader />,
      cell: (props: CellContext<DogRow, string>) => <ActionsCell {...props} />,
      size: 80,
      maxSize: 80,
    }),
  ] as Array<ColumnDef<DogRow>>;
}

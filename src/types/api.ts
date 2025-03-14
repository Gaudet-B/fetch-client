import { DogRow } from "~/app/search/columns";

export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

export type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type Coordinates = {
  lat: number;
  lon: number;
};

export type GeoBox =
  | {
      top: Coordinates;
      left: Coordinates;
      bottom: Coordinates;
      right: Coordinates;
    }
  | {
      bottom_left: Coordinates;
      top_right: Coordinates;
    }
  | {
      bottom_right: Coordinates;
      top_left: Coordinates;
    };

export type LocationSearchType = {
  city?: string;
  states?: string;
  geoBoundingBox?: GeoBox;
  size?: number;
  from?: number;
};

export type LocationsSearchResponseType = {
  results: Array<Location>;
  total: number;
};

export type PaginationType = {
  next: string | undefined;
  prev: string | undefined;
  total: number;
};

export type SortableFields = "age" | "breed" | "name";

export type SearchConfigType = {
  size?: number;
  from?: number;
  sort?: `${SortableFields}:${"asc" | "desc"}`;
};

export type SearchOptionsType = {
  breeds?: Array<string>;
  zipCodes?: Array<string>;
  ageMin?: number;
  ageMax?: number;
} & SearchConfigType;

export type SearchResponseType = {
  resultIds: Array<string>;
  total: number;
  next: string;
  prev: string;
};

export type SearchResultsType = {
  breeds?: Array<string>;
  dogs: Array<DogRow>;
  next: string | undefined;
  prev: string | undefined;
  total: number;
};

export type SearchErrorType = {
  status?: number;
  message?: string;
  redirect?: string;
};

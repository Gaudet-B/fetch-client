import { NextRequest, NextResponse } from "next/server";
import { addLocationsToDogs } from "~/server/searchUtil";
import errorHandler, { ErrorObject } from "~/server/errorHandler";
import {
  getOptions,
  getRequestHeaders,
  postOptions,
} from "~/server/requestOptions";
import {
  Dog,
  Location,
  SearchResponseType,
  SearchResultsType,
} from "~/types/api";

const BASE_URL = process.env.BASE_URL;
const DEFAULT_DOGS_PER_PAGE = 25;
const RESULTS_PER_PAGE = DEFAULT_DOGS_PER_PAGE;

function _handleError(error: ErrorObject) {
  const { redirect, code, message } = error;
  if (redirect) return NextResponse.redirect(redirect);
  return NextResponse.json({ status: code, message });
}

async function getInitialDogIds(request: NextRequest) {
  const options = await getOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(
    `${BASE_URL}/dogs/search?size=${RESULTS_PER_PAGE}`,
    {
      ...options,
      headers,
    },
  );

  if (!response.ok) {
    return await errorHandler(
      request,
      response,
      "Failed to fetch initial dog IDs",
    );
  }

  const searchResult = (await response.json()) as SearchResponseType;

  return searchResult;
}

async function getInitialDogsInfo(dogIds: string[], request: NextRequest) {
  const options = await postOptions();
  const headers = await getRequestHeaders(
    options,
    request,
    JSON.stringify(dogIds),
  );

  const response = await fetch(`${BASE_URL}/dogs`, {
    ...options,
    body: JSON.stringify(dogIds),
    headers,
  });

  if (!response.ok) {
    return await errorHandler(
      request,
      response,
      "Failed to fetch initial dog info",
    );
  }

  return (await response.json()) as Array<Dog>;
}

async function getAllBreeds(request: NextRequest) {
  const options = await getOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/dogs/breeds`, {
    ...options,
    headers,
  });

  if (!response.ok)
    return await errorHandler(request, response, "Failed to fetch all breeds");

  return (await response.json()) as Array<string>;
}

async function getInitialLocations(
  zipCodes: Array<string>,
  request: NextRequest,
) {
  const options = await postOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/locations`, {
    ...options,
    headers,
    body: JSON.stringify(zipCodes),
  });

  if (!response.ok)
    return await errorHandler(
      request,
      response,
      "Failed to fetch initial locations",
    );

  return (await response.json()) as Array<Location | null>;
}

export async function GET(request: NextRequest) {
  const dogIdsResponse = await getInitialDogIds(request);
  if ((dogIdsResponse as ErrorObject).code)
    return _handleError(dogIdsResponse as ErrorObject);

  const { next, prev, total, resultIds } = dogIdsResponse as SearchResponseType;

  const dogsInfo = await getInitialDogsInfo(resultIds, request);
  if ((dogsInfo as ErrorObject).code)
    return _handleError(dogsInfo as ErrorObject);

  const breeds = await getAllBreeds(request);
  if ((breeds as ErrorObject).code) return _handleError(breeds as ErrorObject);

  const zipCodes = (dogsInfo as Array<Dog>).map((dog) => dog.zip_code);

  const locations = await getInitialLocations(zipCodes, request);
  if ((locations as ErrorObject).code)
    return _handleError(locations as ErrorObject);

  const dogs = await addLocationsToDogs(
    dogsInfo as Array<Dog>,
    locations as Array<Location>,
  );

  return NextResponse.json({
    breeds,
    dogs,
    next,
    prev,
    total,
  } as SearchResultsType);
}

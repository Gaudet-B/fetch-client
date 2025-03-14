import { NextRequest, NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import {
  getOptions,
  getRequestHeaders,
  postOptions,
} from "~/server/requestOptions";
import { addLocationsToDogs } from "~/server/searchUtil";
import errorHandler, { ErrorObject } from "~/server/errorHandler";
import {
  Dog,
  Location,
  SearchResponseType,
  SearchResultsType,
} from "~/types/api";

const BASE_URL = process.env.BASE_URL;
const DEFAULT_DOGS_PER_PAGE = 25;
const RESULTS_PER_PAGE = DEFAULT_DOGS_PER_PAGE;

const DEFAULT_SEARCH_URL = `${BASE_URL}/dogs/search?sort=breed:asc&size=${RESULTS_PER_PAGE}`;

function _handleError(error: ErrorObject) {
  const { redirect, code, message } = error;
  return NextResponse.json({ status: code, message, redirect });
}

async function getSearchResults(reqUrl: NextURL, request: NextRequest) {
  const options = await getOptions();
  const headers = await getRequestHeaders(options, request);

  const { search, searchParams } = reqUrl;
  const url = searchParams?.get("url");

  // handle the case where no url or params are provided - this is the default search
  let searchUrl = DEFAULT_SEARCH_URL;
  // handle the case where a full url is provided - this is for pagination (prev, next)
  if (url) searchUrl = `${BASE_URL}${search.slice(5)}`;
  // handle the case where a search query is provided - this is most searches
  else if (search) searchUrl = `${BASE_URL}/dogs/search${search}`;

  const response = await fetch(searchUrl, {
    ...options,
    headers,
  });

  if (!response.ok)
    return await errorHandler(
      request,
      response,
      "Failed to fetch search results",
    );

  const results = (await response.json()) as SearchResponseType;
  return results;
}

async function getDogsInfo(resultIds: string[], request: NextRequest) {
  const options = await postOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/dogs`, {
    ...options,
    body: JSON.stringify(resultIds),
    headers,
  });

  if (!response.ok)
    return await errorHandler(request, response, "Failed to fetch dogs info");

  const dogs = (await response.json()) as Dog[];
  return dogs;
}

async function getLocations(zipCodes: string[], request: NextRequest) {
  const options = await postOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/locations`, {
    ...options,
    headers,
    body: JSON.stringify(zipCodes),
  });

  if (!response.ok)
    return await errorHandler(request, response, "Failed to fetch locations");

  const locations = (await response.json()) as Array<Location> | null;
  return locations;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  const searchResults = await getSearchResults(url, request);
  if ((searchResults as ErrorObject).code)
    return _handleError(searchResults as ErrorObject);

  const { next, prev, resultIds, total } = searchResults as SearchResponseType;

  const dogsInfo = await getDogsInfo(resultIds, request);
  if ((dogsInfo as ErrorObject).code)
    return _handleError(dogsInfo as ErrorObject);

  const zipCodes = (dogsInfo as Array<Dog>).map((dog) => dog.zip_code);

  const locations = await getLocations(zipCodes, request);
  if ((locations as ErrorObject).code)
    return _handleError(locations as ErrorObject);

  const dogs = await addLocationsToDogs(
    dogsInfo as Array<Dog>,
    locations as Array<Location>,
  );

  return NextResponse.json({ dogs, next, prev, total } as SearchResultsType);
}

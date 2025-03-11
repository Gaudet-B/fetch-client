import { NextRequest, NextResponse } from "next/server";
import { getRequestHeaders, postOptions } from "~/server/requestOptions";
import { LocationSearchType, LocationsSearchResponseType } from "~/types/api";
import errorHandlers from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const searchOptions = (await request.json()) as LocationSearchType;

  const options = await postOptions();
  const headers = await getRequestHeaders(
    options,
    request,
    JSON.stringify(searchOptions),
  );

  const response = await fetch(`${BASE_URL}/locations/search`, {
    ...options,
    body: JSON.stringify(searchOptions),
    headers,
  });

  if (!response.ok) {
    const error = await errorHandlers(
      request,
      response,
      "Failed to fetch locations",
    );
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  const locations = (await response.json()) as LocationsSearchResponseType;
  return NextResponse.json(locations.results);
}

import { NextRequest, NextResponse } from "next/server";
import errorHandlers from "~/server/errorHandler";
import { getRequestHeaders, postOptions } from "~/server/requestOptions";
import { Location } from "~/types/api";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const zipCodes = await request.json();

  const options = await postOptions();
  const headers = await getRequestHeaders(
    options,
    request,
    JSON.stringify(zipCodes),
  );

  const response = await fetch(`${BASE_URL}/locations`, {
    ...options,
    body: JSON.stringify(zipCodes),
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

  const locations = (await response.json()) as Array<Location>;
  return NextResponse.json(locations);
}

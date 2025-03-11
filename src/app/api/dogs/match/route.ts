import { NextRequest, NextResponse } from "next/server";
import { getRequestHeaders, postOptions } from "~/server/requestOptions";
import errorHandler from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const { dogIds } = await request.json();
  const options = await postOptions();
  const headers = await getRequestHeaders(
    options,
    request,
    JSON.stringify(dogIds),
  );

  const response = await fetch(`${BASE_URL}/dogs/match`, {
    ...options,
    body: JSON.stringify(dogIds),
    headers,
  });

  if (!response.ok) {
    const error = await errorHandler(
      request,
      response,
      "Failed to fetch match",
    );
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  const result = (await response.json()) as { match: string };
  const { match } = result;

  return NextResponse.json(match);
}

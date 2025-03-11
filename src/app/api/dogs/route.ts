import { NextRequest, NextResponse } from "next/server";
import { getRequestHeaders, postOptions } from "~/server/requestOptions";
import errorHandler from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const options = await postOptions();
  const headers = await getRequestHeaders(options, request);

  const { dogIds } = await request.json();

  if (dogIds.length > 100) {
    throw new Error("Too many dogs to fetch. Max 100");
  }

  const response = await fetch(`${BASE_URL}/dogs`, {
    ...options,
    body: JSON.stringify(dogIds),
    headers,
  });

  if (!response.ok) {
    const error = await errorHandler(request, response, "Failed to fetch dogs");
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  const dogs = await response.json();
  return NextResponse.json(dogs);
}

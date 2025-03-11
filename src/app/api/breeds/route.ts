import { NextRequest, NextResponse } from "next/server";
import { getOptions, getRequestHeaders } from "~/server/requestOptions";
import errorHandler from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  const options = await getOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/breeds`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await errorHandler(
      request,
      response,
      "Failed to fetch breeds",
    );
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  const breeds = await response.json();
  return NextResponse.json(breeds);
}

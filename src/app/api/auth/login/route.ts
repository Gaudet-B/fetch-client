import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { postOptions } from "../../../../server/requestOptions";
import errorHandler from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;
const COOKIE_PREFIX = "fetch-access-token=";
const EXPIRATION_PREFIX = "expires=";

const _getTokenValue = (cookie: string) => {
  const endIndex = cookie.indexOf(";");
  return endIndex >= 0 ? cookie.substring(0, endIndex) : cookie;
};

const _getTokenExpiration = (cookie: string) => {
  const prefix = EXPIRATION_PREFIX;
  const startIndex = cookie.indexOf(prefix);
  if (startIndex < 0) return new Date();
  const endIndex = cookie.indexOf(";");
  return endIndex >= 0
    ? cookie.substring(startIndex + prefix.length, endIndex)
    : cookie.substring(startIndex + prefix.length);
};

const _parseToken = (cookie: string) => {
  const prefix = COOKIE_PREFIX;
  const startIndex = cookie.indexOf(prefix);
  if (startIndex < 0) return { expires: new Date(), value: "" };
  const relevantString = cookie.substring(startIndex + prefix.length);
  const value = _getTokenValue(relevantString);
  const expiration = _getTokenExpiration(relevantString);
  const expires = new Date(expiration);
  return { expires, value };
};

export async function POST(request: NextRequest) {
  const credentials = await request.json();
  const options = await postOptions();
  const response = await fetch(`${BASE_URL}/auth/login`, {
    ...options,
    body: JSON.stringify(credentials),
  });

  const { value, expires } = _parseToken(response.headers.get("set-cookie")!);

  const cookieStore = await cookies();
  cookieStore.set("fetch-access-token", value, {
    expires: expires,
  });

  if (!response.ok) {
    const error = await errorHandler(request, response, "Failed to login");
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  return NextResponse.json(response.status);
}

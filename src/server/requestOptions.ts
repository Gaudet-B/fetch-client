"use server";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function getOptions() {
  return {
    method: "GET",
    credentials: "include",
    headers: {},
  } as const;
}

export async function postOptions() {
  return {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  } as const;
}

export async function getRequestHeaders(
  options:
    | Awaited<ReturnType<typeof postOptions>>
    | Awaited<ReturnType<typeof getOptions>>,
  req: NextRequest,
  body?: string,
) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("fetch-access-token");

  const headers = new Headers({
    ...options.headers,
    [cookie!.name]: cookie!.value,
  });

  for (const [key, value] of req.headers.entries()) headers.set(key, value);
  // for POST request headers
  if (body) headers.set("Content-Type", "application/json");
  if (body) headers.set("Content-Length", body.length.toString());

  return headers;
}

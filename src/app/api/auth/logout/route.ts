import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getRequestHeaders, postOptions } from "~/server/requestOptions";
import errorHandler from "~/server/errorHandler";

const BASE_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const options = await postOptions();
  const headers = await getRequestHeaders(options, request);

  const response = await fetch(`${BASE_URL}/auth/logout`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await errorHandler(request, response, "Failed to logout");
    if (error.redirect) return NextResponse.redirect(error.redirect);
    return NextResponse.json({ status: error.code, message: error.message });
  }

  const cookieStore = await cookies();
  cookieStore.delete("fetch-access-token");
  cookieStore.delete("set-cookie");

  revalidatePath("/login");

  return NextResponse.json({ message: "Logged out successfully" });
}

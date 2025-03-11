import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieName = (await request.json()) as string;
  const cookieStore = await cookies();
  const fetchAccessToken = cookieStore.get(cookieName);
  return NextResponse.json(fetchAccessToken || false);
}

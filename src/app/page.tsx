import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("fetch-access-token");
  if (!token || !token.value) redirect("/login");
  redirect("/search");
}

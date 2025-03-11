import { useMutation } from "@tanstack/react-query";

async function getMatch(dogIds: Array<string>) {
  const response = await fetch("/api/dogs/match", {
    method: "POST",
    body: JSON.stringify({ dogIds }),
  });
  const match = (await response.json()) as string;
  return match;
}

export default function matchMutation() {
  return useMutation({ mutationFn: getMatch });
}

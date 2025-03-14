import { PropsWithChildren } from "react";
import { H1 } from "@designsystem/text";
import { Main } from "@designsystem/container";
import Navigation from "@designsystem/navigation";
import { LoginForm } from "./content";

function LoginContainer({ children }: PropsWithChildren) {
  return (
    // -translate-y-10 centers the container vertically based on height of <Navigation />
    <div className="flex w-96 -translate-y-10 flex-col items-center gap-4 p-4">
      {children}
    </div>
  );
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ auth: string }>;
}) {
  const params = await searchParams;
  const auth = params?.auth;
  const authFailed = auth === "failed";

  return (
    <>
      <Navigation loggedIn={false} />
      <Main>
        <LoginContainer>
          {authFailed && (
            <span className="absolute -translate-y-12 text-base text-red-500">
              authorization token expired - please login again
            </span>
          )}
          <H1>please log in.</H1>
          <LoginForm />
        </LoginContainer>
      </Main>
    </>
  );
}

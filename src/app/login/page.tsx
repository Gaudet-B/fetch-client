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

export default async function Login() {
  return (
    <>
      <Navigation loggedIn={false} />
      <Main>
        <LoginContainer>
          <H1>please log in.</H1>
          <LoginForm />
        </LoginContainer>
      </Main>
    </>
  );
}

import { PropsWithChildren } from "react";
import { Main } from "@designsystem/container";
import Navigation from "@designsystem/navigation";
import { MatchButton, MatchModal, SearchContentContainer } from "./content";

function SearchContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-col items-stretch justify-between">
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex h-14 w-full items-center justify-center border-t border-gray-900 bg-gray-100">
      <div className="w-96">
        <MatchButton />
      </div>
    </footer>
  );
}

export default function SearchLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navigation loggedIn={true} />
      <Main>
        <SearchContainer>
          <SearchContentContainer>
            {children}
            <Footer />
            <MatchModal />
          </SearchContentContainer>
        </SearchContainer>
      </Main>
    </>
  );
}

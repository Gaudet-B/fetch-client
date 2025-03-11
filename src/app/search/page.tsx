import { SearchBar, SearchContent, SearchResults } from "./content";

export default async function Search() {
  return (
    <SearchContent>
      <SearchBar />
      <SearchResults />
    </SearchContent>
  );
}

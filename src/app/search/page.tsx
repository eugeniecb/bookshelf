import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { SearchResults } from "./SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Search Books</h1>
      <Suspense>
        <SearchBar defaultValue={q} />
      </Suspense>
      {q && (
        <div className="mt-8">
          <Suspense
            fallback={
              <p className="text-center text-muted">Searching for &ldquo;{q}&rdquo;...</p>
            }
          >
            <SearchResults query={q} />
          </Suspense>
        </div>
      )}
      {!q && (
        <p className="mt-12 text-center text-muted">
          Enter a title, author, or keyword to find books.
        </p>
      )}
    </div>
  );
}

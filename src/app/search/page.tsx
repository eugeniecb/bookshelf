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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Search Books
        </h1>
        <p className="mt-2 text-muted font-body text-sm">
          Find your next favorite read
        </p>
      </div>
      <Suspense>
        <SearchBar defaultValue={q} />
      </Suspense>
      {q && (
        <div className="mt-10">
          <Suspense
            fallback={
              <p className="text-center text-muted font-body">
                Searching for &ldquo;{q}&rdquo;...
              </p>
            }
          >
            <SearchResults query={q} />
          </Suspense>
        </div>
      )}
      {!q && (
        <p className="mt-16 text-center text-muted font-body">
          Enter a title, author, or keyword to find books.
        </p>
      )}
    </div>
  );
}

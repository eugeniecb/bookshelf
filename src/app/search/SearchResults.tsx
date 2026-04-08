import { BookCard } from "@/components/BookCard";
import { BookGrid } from "@/components/BookGrid";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getUserFavorites } from "@/app/actions";
import { auth } from "@clerk/nextjs/server";

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
};

async function searchBooks(query: string) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year`,
    {
      headers: { "User-Agent": "Bookshelf/1.0" },
    }
  );
  const data = await res.json();
  return (data.docs || []) as OpenLibraryDoc[];
}

export async function SearchResults({ query }: { query: string }) {
  const [books, { userId }] = await Promise.all([
    searchBooks(query),
    auth(),
  ]);

  const userFavorites = userId ? await getUserFavorites() : [];

  if (books.length === 0) {
    return (
      <p className="text-center text-muted">
        No results found for &ldquo;{query}&rdquo;. Try a different search.
      </p>
    );
  }

  return (
    <BookGrid>
      {books.map((book) => {
        const workKey = book.key.replace("/works/", "");
        return (
          <BookCard
            key={workKey}
            workKey={workKey}
            title={book.title}
            authorName={book.author_name?.[0]}
            coverId={book.cover_i}
            firstPublishYear={book.first_publish_year}
          >
            <FavoriteButton
              workKey={workKey}
              title={book.title}
              authorName={book.author_name?.[0] || "Unknown"}
              coverId={book.cover_i ?? null}
              firstPublishYear={book.first_publish_year ?? null}
              isFavorited={userFavorites.includes(workKey)}
              isSignedIn={!!userId}
            />
          </BookCard>
        );
      })}
    </BookGrid>
  );
}

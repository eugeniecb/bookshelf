import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BookCard } from "@/components/BookCard";
import { BookGrid } from "@/components/BookGrid";
import { FavoriteButton } from "@/components/FavoriteButton";
import Link from "next/link";

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("work_key, created_at, books(title, author_name, cover_id, first_publish_year)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const items = favorites || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted">No favorites yet!</p>
          <Link
            href="/search"
            className="mt-4 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Search for books
          </Link>
        </div>
      ) : (
        <BookGrid>
          {items.map((fav) => {
            const book = fav.books as unknown as {
              title: string;
              author_name: string;
              cover_id: number | null;
              first_publish_year: number | null;
            };
            return (
              <BookCard
                key={fav.work_key}
                workKey={fav.work_key}
                title={book.title}
                authorName={book.author_name}
                coverId={book.cover_id}
                firstPublishYear={book.first_publish_year}
              >
                <FavoriteButton
                  workKey={fav.work_key}
                  title={book.title}
                  authorName={book.author_name || "Unknown"}
                  coverId={book.cover_id}
                  firstPublishYear={book.first_publish_year}
                  isFavorited={true}
                  isSignedIn={true}
                />
              </BookCard>
            );
          })}
        </BookGrid>
      )}
    </div>
  );
}
